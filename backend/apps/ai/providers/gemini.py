from django.conf import settings

from google import genai
from google.genai.errors import ClientError
from google.genai import errors as genai_errors

from .base import AIProvider
from apps.ai.schemas.improve_idea import ImproveIdeaResponse
from .. import exceptions

import logging
logger = logging.getLogger(__name__)


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

            if response.parsed is None:
                logger.error(
                    "Gemini returned no parsed output. text=%r",
                    getattr(response, "text", None),
                )
                raise exceptions.AIProviderException(
                    "Model response did not match the expected schema"
                )

            return response.parsed

        except genai_errors.ClientError as exc:
            logger.error("Gemini ClientError: %s", exc)

            if exc.status == "RESOURCE_EXHAUSTED":
                raise exceptions.AIQuotaExceededException() from exc

            raise exceptions.AIProviderException() from exc

        except genai_errors.ServerError as exc:
            logger.error("Gemini ServerError: %s", exc)
            raise exceptions.AIProviderException() from exc

        except exceptions.AIProviderException:
            # re-raise as-is so the None-parsed branch above isn't
            # re-wrapped by the catch-all below
            raise

        except Exception as exc:
            logger.exception("Unexpected error calling Gemini")
            raise exceptions.AIProviderException() from exc
