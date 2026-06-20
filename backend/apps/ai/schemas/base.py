from abc import ABC, abstractmethod
from pydantic import BaseModel


class AISchema(BaseModel, ABC):

    @classmethod
    @abstractmethod
    def mock(cls):
        """Return mock data for development/testing."""
        raise NotImplementedError