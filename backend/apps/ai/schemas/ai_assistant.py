from pydantic import BaseModel
from typing import List


class GoalSummaryResponse(BaseModel):
    overview: str
    progress_status: str
    completed_items: List[str]
    active_items: List[str]

    @classmethod
    def mock_summary(cls):
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