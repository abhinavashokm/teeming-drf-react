from apps.ai.providers.registry import ProviderRegistry
from apps.ai.prompts.improve_idea import (
    build_improve_idea_prompt,
)
from apps.ai.schemas.improve_idea import ImproveIdeaResponse


class AIService:

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
