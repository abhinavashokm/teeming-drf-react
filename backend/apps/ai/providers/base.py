from abc import ABC, abstractmethod


class AIProvider(ABC):

    @abstractmethod
    def generate_text(self, prompt: str, system_prompt: str | None = None) -> str:
        pass

    @abstractmethod
    def generate_structured(
        self,
        prompt: str,
        schema,
    ):
        pass