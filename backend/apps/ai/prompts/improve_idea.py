def build_improve_idea_prompt(
    title: str,
    description: str,
):
    return f"""
You are a product management assistant.

Improve the following idea.

Title:
{title}

Description:
{description}

Return ONLY valid JSON.

Required format:

{{
    "improved_title": "string",
    "improved_description": "string",
}}
"""