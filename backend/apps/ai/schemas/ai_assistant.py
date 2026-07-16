from typing import List
from .base import AISchema


class GoalSummaryResponse(AISchema):
    overview: str
    progress_status: str
    completed_items: List[str]
    active_items: List[str]

    def build_content(self):
        return {
            "sections": [
                {
                    "type": "text",
                    "title": "Overview",
                    "body": self.overview,
                },
                {
                    "type": "text",
                    "title": "Progress Status",
                    "body": self.progress_status,
                },
                {
                    "type": "list",
                    "title": "Completed Work",
                    "body": self.completed_items,
                },
                {
                    "type": "list",
                    "title": "Active Work",
                    "body": self.active_items,
                },
            ],
        }

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

    def build_content(self):
        return {
            "sections": [
                {
                    "type": "list",
                    "title": "Suggested Ideas",
                    "body": self.suggestions,
                }
            ]
        }

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
    

class AICustomChatResponse(AISchema):
    response: str

    def build_content(self):
        return {
            "sections": [
                {
                    "type": "text",
                    "title": "Response",
                    "body": self.response,
                }
            ]
        }

    @classmethod
    def mock(cls):
        return cls(
            response=(
                "Based on the current goal progress, I recommend focusing on "
                "improving onboarding analytics first. This will help identify "
                "where users drop off and provide clearer direction for future "
                "improvements."
            )
        )