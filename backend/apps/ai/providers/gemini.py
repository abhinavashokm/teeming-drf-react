from django.conf import settings

from google import genai
from google.genai.errors import ClientError

from .base import AIProvider
from apps.ai.schemas.improve_idea import ImproveIdeaResponse
from .. import exceptions


class GeminiProvider(AIProvider):

    def __init__(self):
        self.client = genai.Client(
            api_key=settings.GEMINI_API_KEY,
        )

    def generate_text(
        self,
        prompt: str,
        system_prompt: str | None = None,
    ) -> str:

        response = self.client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": ImproveIdeaResponse,
            },
        )

        return response.text
    
    def _generate_structured(
        self,
        prompt: str,
        schema,
    ):
        
        try:
            response = self.client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=prompt,

                config=genai.types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=schema,
                )
            )

            return response.parsed
        
        except ClientError as exc:
            print(exc)

            if "RESOURCE_EXHAUSTED" in str(exc):
                raise exceptions.AIQuotaExceededException(
                    str(exc)
                ) from exc

            raise exceptions.AIProviderException(
                str(exc)
            ) from exc
