from pydantic import BaseModel
from typing import List
from .base import AISchema


class GoalSummaryResponse(AISchema):
    overview: str
    progress_status: str
    completed_items: List[str]
    active_items: List[str]

    @classmethod
    def mock(cls):
        return cls(
            overview=(
                "This goal focuses on improving user onboarding and increasing "
                "user retention through a better first-time user experience."
            ),
            progress_status=(
                "Progress is on track. Multiple initiatives have been completed "
                "while several high-impact ideas are currently in progress."
            ),
            completed_items=[
                "Implemented welcome email campaign",
                "Created onboarding checklist",
                "Launched first-time user walkthrough",
            ],
            active_items=[
                "Improve onboarding analytics",
                "Optimize signup conversion flow",
                "Develop personalized user recommendations",
            ],
        )
    

class GoalIdeaSuggestionsResponse(AISchema):
    suggestions: List[str]

    @classmethod
    def mock(cls):
        return cls(
            suggestions=[
                "Introduce a guided onboarding tour for new users",
                "Add milestone-based progress tracking to increase engagement",
                "Implement automated check-in reminders for team members",
                "Create a feedback collection workflow after goal completion",
                "Provide personalized recommendations based on user activity",
            ]
        )