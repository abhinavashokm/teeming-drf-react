from django.conf import settings
from abc import ABC, abstractmethod

class AIProvider(ABC):

    @abstractmethod
    def generate_text(self, prompt: str, system_prompt: str | None = None) -> str:
        pass

    def generate_structured(
        self,
        prompt: str,
        schema,
    ):
        if settings.USE_MOCK_AI:
            return schema.mock()

        return self._generate_structured(
            prompt=prompt,
            schema=schema,
        )

    @abstractmethod
    def _generate_structured(
        self,
        prompt: str,
        schema,
    ):
        pass