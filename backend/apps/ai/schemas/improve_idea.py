from pydantic import BaseModel


class ImproveIdeaResponse(BaseModel):
    improved_title: str
    improved_description: str

    @classmethod
    def mock_response(cls):
        return cls(
            improved_title = "This is mock data",
            improved_description="this is also mock data..."
        )