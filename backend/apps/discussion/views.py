from core.permission_views import MemberBaseView
from core.responses.api_response import success_response
from . import discussion_services, serializers


class DiscussionListView(MemberBaseView):

    def get(self, request, **kwargs):

        messages = discussion_services.list_discussion_messages(
            workspace=request.workspace, goal_id=kwargs["goal_id"]
        )

        return success_response(
            data={
                "messages": serializers.ReadDiscussionMessageSerializer(
                    messages, many=True
                ).data
            }
        )
