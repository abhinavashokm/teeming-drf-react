from pydantic import BaseModel


class ImproveIdeaResponse(BaseModel):
    improved_title: str
    improved_description: str