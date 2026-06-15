from django.conf import settings

from .gemini import GeminiProvider


class ProviderRegistry:

    @staticmethod
    def get_provider():
        provider_name = settings.AI_PROVIDER

        providers = {
            "gemini": GeminiProvider,
        }

        provider_class = providers.get(provider_name)

        if not provider_class:
            raise ValueError(
                f"Unsupported AI provider: {provider_name}"
            )

        return provider_class()