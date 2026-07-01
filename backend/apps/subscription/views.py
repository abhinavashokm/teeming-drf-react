from .services import subscription_services, plan_services
from core.responses.api_response import success_response
from . import serializers
from core.permission_views import AdminBaseView


class UserListPlanView(AdminBaseView):

    def get(self, requset, **kwargs):

        plans = plan_services.list_active_plans()

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

        current_subscription = subscription_services.get_current_subscription(
            workspace=request.workspace
        )

        return success_response(
            data=serializers.WorkspaceSubscriptionSerializer(current_subscription).data
        )


class CancelCurrentSubscriptionView(AdminBaseView):
    """
    Cancel current subscription, automatically expire at end time
    """

    def post(self, request, **kwargs):
        
        subscription_services.downgrade_to_free(workspace=request.workspace)

        return success_response(
            message="Subscription cancelled"
        )
    

class ResumeCurrentSubscription(AdminBaseView):
    """
    resume current subscription plan if subscription is cancelled or scheduled downgrade
    """

    def patch(self, request, **kwargs):

        subscription_services.resume_current_subscription(
            workspace=request.workspace
        )

        return success_response(
            message="Current plan resumed"
        )
    

class SubscriptionUpgradeView(AdminBaseView):
    """
    upgrade subscription from an existing paid plan to higher tier plan. 
    so we have their stripe customer id. we can pay directly
    """
 
    def post(self, request, **kwargs):
 
        serializer = serializers.UpgradePlanSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
 
        subscription = subscription_services.upgrade_subscription_plan(
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
    

class SubscriptionDowngradeView(AdminBaseView):
    """
    downgrade subscription from an existing paid plan to lower tier plan. 
    we schedule the downgrade until existing high tier plan ends
    """
 
    def post(self, request, **kwargs):
 
        serializer = serializers.UpgradePlanSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
 
        subscription = subscription_services.downgrade_subscription_plan(
            workspace=request.workspace,
            plan=serializer.validated_data["plan"],
        )
 
        return success_response(
            message="Downgrade scheduled",
            data={
                "scheduled_plan_id": subscription.scheduled_plan_id,
            },
        )
 

    
