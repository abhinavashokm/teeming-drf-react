from .base import AISchema


class ImproveIdeaResponse(AISchema):
    improved_title: str
    improved_description: str

    def build_content(self):
        return {
            "improved_title": self.improved_title,
            "improved_description": self.improved_description
        }

    @classmethod
    def mock(cls):
        return cls(
            improved_title = "This is mock data",
            improved_description="this is also mock data..."
        )