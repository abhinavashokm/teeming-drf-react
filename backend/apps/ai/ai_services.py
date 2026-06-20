from apps.ai.providers.registry import ProviderRegistry
from apps.ai.prompts.improve_idea import build_improve_idea_prompt
from apps.ai.prompts.ai_assistant import (
    build_summary_prompt,
    build_idea_suggestions_prompt,
)

from apps.ai.schemas.improve_idea import ImproveIdeaResponse
from apps.ai.schemas.ai_assistant import (
    GoalSummaryResponse,
    GoalIdeaSuggestionsResponse,
)
from apps.goal.helpers.goal_helper import get_goal_or_raise
from apps.idea.models import Idea
from .models import AIAssistantResponse


class ImproveIdeaService:

    def __init__(self):
        self.provider = ProviderRegistry.get_provider()

    def improve_idea(
        self,
        title: str,
        description: str,
    ):

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

    def execute(self, action):

        actions = {
            AIAssistantResponse.ResponseType.SUMMARY: self.summarize,
            AIAssistantResponse.ResponseType.IDEA_SUGGESTIONS: self.suggest_ideas,
        }

        handler = actions.get(action)

        if not handler:
            raise ValueError(f"Unsupported action: {action}")

        return handler()

    def summarize(self):

        context = self.build_context(self.goal)

        prompt = build_summary_prompt(context=context)

        response = self.provider.generate_structured(
            prompt=prompt,
            schema=GoalSummaryResponse,
        )

        content = self.build_summary_content(response)

        return AIAssistantResponse.objects.create(
            workspace=self.workspace,
            goal=self.goal,
            user=self.user,
            type=AIAssistantResponse.ResponseType.SUMMARY,
            content=content,
        )

    def suggest_ideas(self):

        context = self.build_context(self.goal)

        prompt = build_idea_suggestions_prompt(
            context=context,
        )

        response = self.provider.generate_structured(
            prompt=prompt,
            schema=GoalIdeaSuggestionsResponse,
        )

        content = self.build_idea_suggestions_content(response)

        return AIAssistantResponse.objects.create(
            workspace=self.workspace,
            goal=self.goal,
            user=self.user,
            type=AIAssistantResponse.ResponseType.IDEA_SUGGESTIONS,
            content=content,
        )

    @staticmethod
    def build_context(goal):

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

    @staticmethod
    def build_summary_content(summary: GoalSummaryResponse):
        return {
            "sections": [
                {
                    "type": "text",
                    "title": "Overview",
                    "body": summary.overview,
                },
                {
                    "type": "text",
                    "title": "Progress Status",
                    "body": summary.progress_status,
                },
                {
                    "type": "list",
                    "title": "Completed Work",
                    "body": summary.completed_items,
                },
                {
                    "type": "list",
                    "title": "Active Work",
                    "body": summary.active_items,
                },
            ],
        }

    @staticmethod
    def build_idea_suggestions_content(
        suggestions: GoalIdeaSuggestionsResponse,
    ):
        return {
            "sections": [
                {
                    "type": "list",
                    "title": "Suggested Ideas",
                    "body": suggestions.suggestions,
                }
            ]
        }


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
