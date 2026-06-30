from rest_framework.views import APIView
from .services import subscription_services
from core.responses.api_response import success_response
from . import serializers
from rest_framework import status
from core.permission_views import AdminBaseView
    

class AdminPlanDetailView(APIView):

    def delete(self, request, **kwargs):

        subscription_services.delete_plan(plan_id=kwargs["plan_id"])

        return success_response(message="Plan deleted")


class UserListPlanView(AdminBaseView):

    def get(self, requset, **kwargs):

        plans = subscription_services.list_active_plans()

        return success_response(
            data={
                "plans": serializers.UserReadPlanSerializer(plans, many=True).data
            }
        )
    

class SubscriptionCheckoutView(AdminBaseView):

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
    

class SubscriptionUpgradePreviewView(AdminBaseView):
 
    def get(self, request, **kwargs):

        preview = subscription_services.preview_upgrade(
            workspace=request.workspace,
            plan_id=kwargs["plan_id"],
        )
 
        return success_response(
            message="Upgrade preview calculated",
            data={
                "amount_due": int(preview["amount_due"]),
                "currency": preview["currency"],
            },
        )
    

class CurrentPlanView(AdminBaseView):

    def get(self, request, **kwargs):

        current_subscription = subscription_services.get_current_plan(
            workspace=request.workspace
        )

        return success_response(
            data=serializers.WorkspaceSubscriptionSerializer(current_subscription).data
        )


class CancelCurrentSubscriptionView(AdminBaseView):

    def post(self, request, **kwargs):
        
        subscription_services.downgrade_to_free(workspace=request.workspace)

        return success_response(
            message="Subscription cancelled"
        )
    

class ResumeCurrentSubscription(AdminBaseView):

    def patch(self, request, **kwargs):

        subscription_services.resume_current_subscription(
            workspace=request.workspace
        )

        return success_response(
            message="Current plan resumed"
        )
    

class SubscriptionUpgradeView(AdminBaseView):
 
    def post(self, request, **kwargs):
 
        serializer = serializers.UpgradePlanSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
 
        subscription = subscription_services.upgrade_plan(
            workspace=request.workspace,
            plan=serializer.validated_data["plan"],
        )
 
        return success_response(
            message="Subscription upgraded",
            data={
                "subscription_id": subscription.id,
                "plan_id": subscription.plan_id,
            },
        )
 

    
