def build_summary_prompt(context):
    return f""""
    You are an AI project assistant.

    Analyze the goal and its ideas.

    Generate:

    1. Short goal overview
    2. Current progress
    3. Key completed work
    4. Important ongoing work

    Keep response under 250 words.

    Context:

    {context}
    """


def build_idea_suggestions_prompt(context):
    return f"""
    You are an AI project assistant.

    Analyze the goal and its existing ideas.

    Suggest 5 new ideas that could help achieve the goal.

    Requirements:
    - Suggestions should be practical and actionable.
    - Do not repeat existing ideas.
    - Focus on gaps, improvements, risks, opportunities, and next steps.
    - Keep each suggestion concise (one sentence).
    - Prioritize ideas with high potential impact.

    Context:

    {context}
    """


def build_custom_chat_prompt(context, message):
    return f"""
    You are an AI project assistant.

    Answer the user's question using the goal context provided below.

    Keep responses concise, practical, and relevant to the goal.

    USER QUESTION:
    {message}

    CONTEXT:

    {context}
    """
