from core.permission_views import (
    WorkspacePermissionBaseView,
    MemberBaseView,
    AdminBaseView,
)
from core.permissions import IsWorkspaceAdmin, IsWorkspaceMember
from core.responses.api_response import success_response
from rest_framework import status
from .serializers import GoalWriteSerializer, GoalReadSerializer
from . import goal_services


class GoalListCreateView(WorkspacePermissionBaseView):
    "create, list goals"

    permission_map = {"GET": [IsWorkspaceMember], "POST": [IsWorkspaceAdmin]}

    def post(self, request, **kwargs):

        serializer = GoalWriteSerializer(
            data=request.data, context={"request": request.data}, partial=True
        )
        serializer.is_valid(raise_exception=True)

        goal = goal_services.create_goal(
            data={
                "created_by": request.user,
                "workspace": request.workspace,
                **serializer.validated_data,
            }
        )

        goal_data = GoalReadSerializer(goal).data

        return success_response(
            status_code=status.HTTP_201_CREATED,
            message="Goal created",
            data=goal_data,
        )

    def get(self, request, **kwargs):

        params = request.query_params

        goals = goal_services.list_workspace_goals(
            workspace=request.workspace,
            user=request.user,
            limit=params.get("limit"),
        )

        goals_data = GoalReadSerializer(goals, many=True).data

        return success_response(
            status_code=status.HTTP_200_OK, data={"goals": goals_data}
        )


class GoalDetailView(WorkspacePermissionBaseView):
    "Retrive, Update, Delete Goal"

    permission_map = {
        "GET": [IsWorkspaceMember],
        "PATCH": [IsWorkspaceAdmin],
        "DELETE": [IsWorkspaceAdmin],
    }

    def get(self, request, **kwargs):

        goal = goal_services.get_goal(
            workspace=request.workspace, goal_id=kwargs["goal_id"]
        )

        serializer = GoalReadSerializer(goal)

        return success_response(status_code=status.HTTP_200_OK, data=serializer.data)
    

    def patch(self, request, **kwargs):
        serializer = GoalWriteSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        updated_goal = goal_services.update_goal(
            workspace=request.workspace,
            goal_id=kwargs["goal_id"],
            data=serializer.validated_data,
        )

        return success_response(
            status_code=status.HTTP_200_OK,
            data=GoalReadSerializer(updated_goal).data,
            message="Goal updated",
        )

    def delete(self, request, **kwargs):

        goal_services.delete_goal(
            workspace=request.workspace, goal_id=kwargs["goal_id"]
        )

        return success_response(message="Goal deleted", status_code=status.HTTP_200_OK)


class GoalStarView(MemberBaseView):
    """star or unstar a goal by current user"""

    def post(self, request, **kwargs):
        """star goal by user"""

        goal_services.star_goal(
            user=request.user, workspace=request.workspace, goal_id=kwargs["goal_id"]
        )

        return success_response(status_code=status.HTTP_201_CREATED)

    def delete(self, request, **kwargs):
        """unstar goal by user"""

        goal_services.unstar_goal(
            user=request.user, workspace=request.workspace, goal_id=kwargs["goal_id"]
        )

        return success_response(status_code=status.HTTP_204_NO_CONTENT)
