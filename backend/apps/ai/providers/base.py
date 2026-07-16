import time

from django.conf import settings
from abc import ABC, abstractmethod
from .. import exceptions

class AIProvider(ABC):

    @abstractmethod
    def generate_text(self, prompt: str, system_prompt: str | None = None) -> str:
        pass

    def generate_structured(
        self,
        prompt: str,
        schema,
    ):
        if settings.DEBUG:  
            #force exception for testing
            force_error = getattr(settings, "FORCE_AI_ERROR", None)
            if force_error == "quota":
                time.sleep(1)
                raise exceptions.AIQuotaExceededException()
            if force_error == "unavilable":
                time.sleep(1)
                raise exceptions.AIProviderException()
            
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