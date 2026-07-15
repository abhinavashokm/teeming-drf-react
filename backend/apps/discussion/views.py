from core.permission_views import MemberBaseView
from core.responses.api_response import success_response
from . import discussion_services, serializers


class DiscussionListView(MemberBaseView):

    def get(self, request, **kwargs):

        discussion_res = discussion_services.list_discussion_messages(
            workspace=request.workspace, 
            goal_id=kwargs["goal_id"],
            page=request.query_params.get('page', 1),
        )

        return success_response(
            data={
                "messages": serializers.ReadDiscussionMessageSerializer(
                    discussion_res["messages"], many=True
                ).data,
                "has_more": discussion_res["has_more"],
                "total": discussion_res["total"],
            }
        )
