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
    pass