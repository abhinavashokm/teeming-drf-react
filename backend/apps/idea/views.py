from rest_framework import status

from core.permission_views import MemberBaseView
from core.responses.api_response import success_response
from . import idea_services



class IdeaListCreateView(MemberBaseView):
    

    def post(self, request, **kwargs):
        """create an idea suggestion (in progress)"""

        idea_services.create_idea(
            workspace=self.workspace,
            goal_id=kwargs['goal_id'],
            data= request.data
        )

        return success_response(
            message="Idea created",
            status_code=status.HTTP_201_CREATED,
        )
