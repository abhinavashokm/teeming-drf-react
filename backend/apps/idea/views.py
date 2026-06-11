from rest_framework import status

from core.permission_views import MemberBaseView, AdminBaseView
from core.responses.api_response import success_response
from . import idea_services
from . import serializers
from .helpers.idea_helper import get_idea_or_raise


class IdeaListCreateView(MemberBaseView):

    def post(self, request, **kwargs):
        """create an idea suggestion (in progress)"""

        serializer = serializers.WriteIdeaSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        created_idea = idea_services.create_idea(
            created_by=request.user,
            workspace=request.workspace,
            goal_id=kwargs["goal_id"],
            data=serializer.validated_data,
        )

        return success_response(
            message="Idea created",
            status_code=status.HTTP_201_CREATED,
            data=serializers.IdeaReadSerializer(created_idea).data,
        )

    def get(self, request, **kwargs):

        ideas = idea_services.list_goal_ideas(
            workspace=request.workspace, goal_id=kwargs["goal_id"]
        )

        return success_response(
            data={"ideas": serializers.IdeaReadSerializer(ideas, many=True).data},
            status_code=status.HTTP_200_OK,
        )


class IdeaDetailView(MemberBaseView):

    def get(self, request, **kwargs):

        idea = idea_services.get_idea(
            workspace=request.workspace, idea_id=kwargs["idea_id"]
        )

        return success_response(data=serializers.IdeaReadSerializer(idea).data)

    def patch(self, request, **kwargs):

        idea = get_idea_or_raise(workspace=request.workspace, idea_id=kwargs["idea_id"])

        serializer = serializers.WriteIdeaSerializer(
            instance=idea, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)

        updated_idea = serializer.save()

        return success_response(
            message="Idea updated",
            data=serializers.IdeaReadSerializer(updated_idea).data,
        )

    def delete(self, request, **kwargs):

        idea_services.delete_idea(
            workspace=request.workspace, idea_id=kwargs["idea_id"]
        )

        return success_response(message="Idea deleted")


class IdeaMoveToPlannedView(AdminBaseView):

    def post(self, request, **kwargs):

        serializer = serializers.IdeaMoveToPlannedSerializer(
            data=request.data, context={"idea_id": kwargs["idea_id"]}
        )
        serializer.is_valid(raise_exception=True)

        updated_idea = idea_services.move_idea_to_planned(
            current_user=request.user,
            workspace=request.workspace,
            idea_id=kwargs["idea_id"],
            assignees=serializer.validated_data.get("assignees"),
            deadline=serializer.validated_data.get("deadline", None),
        )

        return success_response(
            message="Idea moved to planned",
            data=serializers.IdeaReadSerializer(updated_idea).data,
            status_code=status.HTTP_201_CREATED,
        )


class IdeaMoveToProgressView(AdminBaseView):

    def post(self, request, **kwargs):

        updated_idea = idea_services.move_idea_to_progress(
            current_user=request.user,
            workspace=request.workspace,
            idea_id=kwargs["idea_id"],
        )

        return success_response(
            message="Idea moved to in progress",
            data=serializers.IdeaReadSerializer(updated_idea).data,
            status_code=status.HTTP_201_CREATED,
        )


class IdeaMoveToDoneView(MemberBaseView):

    def post(self, request, **kwargs):

        serializer = serializers.IdeaMoveToDoneSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        updated_idea = idea_services.move_idea_to_done(
            current_user=request.user,
            workspace=request.workspace,
            idea_id=kwargs["idea_id"],
            note=serializer.validated_data.get("note", None),
        )

        return success_response(
            message="Idea moved to done",
            status_code=status.HTTP_201_CREATED,
            data=serializers.IdeaReadSerializer(updated_idea).data,
        )
