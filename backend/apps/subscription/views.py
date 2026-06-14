from rest_framework.views import APIView
from core.responses.api_response import success_response
from . import serializers, subscription_services
from rest_framework import status
from core.permission_views import MemberBaseView


#test mode - staff permission pending to add
class AdminPlanListCreateView(APIView):

    def get(self, request):

        plans = subscription_services.list_plans()

        return success_response(
            data={
                "plans": serializers.AdminReadPlanSerializer(plans, many=True).data
            }
        )
    
    def post(self, request):

        serializer = serializers.AdminWritePlanSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        new_plan = subscription_services.create_plan(serializer.validated_data)

        return success_response(
            message="Plan created",
            data=serializers.AdminReadPlanSerializer(new_plan).data,
            status_code=status.HTTP_201_CREATED,
        )
    

class AdminPlanDetailView(APIView):

    def delete(self, request, **kwargs):

        subscription_services.delete_plan(plan_id=kwargs["plan_id"])

        return success_response(message="Plan deleted")


class UserListPlanView(APIView):

    def get(self, requset, **kwargs):

        plans = subscription_services.list_plans()

        return success_response(
            data={
                "plans": serializers.UserReadPlanSerializer(plans, many=True).data
            }
        )
    

class SubscriptionCheckoutView(MemberBaseView):

    def post(self, request, **kwargs):

        serializer = serializers.CreateCheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        session = subscription_services.create_checkout_session(
            workspace=request.workspace,
            plan=serializer.validated_data["plan"],
        )

        return success_response(
            message="checkout session created",
            data={
                "session_id": session.id,
                "checkout_url": session.url,
            }
        )
    

class CurrentPlanView(MemberBaseView):

    def get(self, request, **kwargs):

        current_subscription = subscription_services.get_current_plan(
            workspace=request.workspace
        )

        print(current_subscription)

        return success_response(
            data=serializers.WorkspaceSubscriptionSerializer(current_subscription).data
        )


    
