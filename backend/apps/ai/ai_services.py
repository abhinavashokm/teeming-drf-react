from apps.ai.providers.registry import ProviderRegistry
from apps.ai.prompts.improve_idea import build_improve_idea_prompt
from apps.ai.prompts.ai_assistant import (
    build_summary_prompt,
    build_idea_suggestions_prompt,
    build_custom_chat_prompt,
)

from apps.ai.schemas.improve_idea import ImproveIdeaResponse
from apps.ai.schemas.ai_assistant import (
    GoalSummaryResponse,
    GoalIdeaSuggestionsResponse,
    AICustomChatResponse,
)
from apps.goal.helpers.goal_helper import get_goal_or_raise
from apps.idea.models import Idea
from .models import AIAssistantResponse
from apps.subscription.services import entitlements
from apps.subscription.constants import Features


class ImproveIdeaService:

    def __init__(self, workspace):
        self.provider = ProviderRegistry.get_provider()
        self.workspace = workspace

    def improve_idea(
        self,
        title: str,
        description: str,
    ):
        #guard to check if current subscription allow ai enhancements
        entitlements.raise_if_feature_not_available(
            workspace=self.workspace,
            feature_code=Features.AI_ENHANCEMENTS
        )

        prompt = build_improve_idea_prompt(
            title=title,
            description=description,
        )

        response = self.provider.generate_structured(
            prompt=prompt,
            schema=ImproveIdeaResponse,
        )

        return response


class GoalAssistantService:

    def __init__(self, current_user, workspace, goal_id):
        self.user = current_user
        self.workspace = workspace
        self.goal = get_goal_or_raise(workspace=workspace, goal_id=goal_id)
        self.provider = ProviderRegistry.get_provider()
        self.context = self._build_context(self.goal)

    def execute(self, action, message=None):

        #guard to check if current subscription allow ai assistant
        entitlements.raise_if_feature_not_available(
            workspace=self.workspace,
            feature_code=Features.AI_ASSISTANT
        )

        configs = {
            AIAssistantResponse.ResponseType.SUMMARY: {
                "prompt": build_summary_prompt(
                    context=self.context,
                ),
                "schema": GoalSummaryResponse,
            },
            AIAssistantResponse.ResponseType.IDEA_SUGGESTIONS: {
                "prompt": build_idea_suggestions_prompt(
                    context=self.context,
                ),
                "schema": GoalIdeaSuggestionsResponse,
            },
            AIAssistantResponse.ResponseType.CUSTOM_CHAT: {
                "prompt": build_custom_chat_prompt(
                    context=self.context,
                    message=message,
                ),
                "schema": AICustomChatResponse,
            },
        }

        config = configs.get(action)

        if not config:
            raise ValueError(f"Unsupported action: {action}")

        return self._generate_response(
            response_type=action,
            prompt=config["prompt"],
            schema=config["schema"],
            message=message,
        )

    def _generate_response(
        self,
        response_type,
        prompt,
        schema,
        message=None
    ):
        response = self.provider.generate_structured(
            prompt=prompt,
            schema=schema,
        )

        return AIAssistantResponse.objects.create(
            workspace=self.workspace,
            goal=self.goal,
            user=self.user,
            type=response_type,
            content=response.build_content(),
            request_text=message,
        )

    @staticmethod
    def _build_context(goal):

        ideas = (
            Idea.objects.filter(goal=goal, is_deleted=False)
            .select_related("created_by")
            .order_by("-created_at")
        )

        context_parts = []
        total_ideas = ideas.count()

        # Goal
        context_parts.append(f"""
            GOAL

            Title: {goal.name}
            Description: {goal.description or 'No description provided'}
            """)

        context_parts.append(f"""
            GOAL METRICS

            Total Ideas: {total_ideas}
            """)

        # Ideas
        if ideas.exists():

            context_parts.append("\nIDEAS\n")

            for idx, idea in enumerate(ideas, start=1):

                owner = (
                    idea.created_by.full_name
                    if getattr(idea, "created_by", None)
                    else "Unassigned"
                )

                context_parts.append(f"""
                    Idea {idx}
                    Title: {idea.title}
                    Description: {idea.description or 'No description'}
                    Status: {idea.status}
                    Owner: {owner}
                    """)

        else:
            context_parts.append("\nNo ideas have been added yet.\n")

        return "\n".join(context_parts)


def list_ai_assistant_responses(current_user, workspace, goal_id):
    goal = get_goal_or_raise(
        workspace=workspace,
        goal_id=goal_id,
    )

    return AIAssistantResponse.objects.filter(user=current_user, goal=goal)


def clear_all_assistant_responses(current_user, workspace, goal_id):
    goal = get_goal_or_raise(
        workspace=workspace,
        goal_id=goal_id,
    )

    AIAssistantResponse.objects.filter(user=current_user, goal=goal).delete()
