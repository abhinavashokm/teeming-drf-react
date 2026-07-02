from .subscription_services import get_current_subscription
from ..exceptions import FeatureNotAvailableException, PlanLimitExceededException


def check_has_feature(workspace, feature_code: str) -> bool:
    """
    check if workspace's current subscription include the given feature
    feature_code must match a boolean field on Plan, e.g. 'can_use_ai_assistant'
    """
    subscription = get_current_subscription(workspace=workspace)
    if not subscription:
        return False
    return getattr(subscription.plan, feature_code, False)


def check_is_within_limit(workspace, limit_field: str, current_count: int) -> bool:
    """
    check if workspace's current subscription not exceeded given limit
    Returns True if under limit (or unlimited). limit_field e.g. 'max_members'
    """
    subscription = get_current_subscription(workspace=workspace)
    if not subscription:
        return False

    limit = getattr(subscription.plan, limit_field, None)
    if limit is None:  # None = unlimited
        return True
    return current_count < limit


def raise_if_feature_not_available(
    workspace, feature_code: str, feature_label: str = None
):
    """Use inside services before performing the gated action — raises directly."""

    if not check_has_feature(workspace, feature_code):
        raise FeatureNotAvailableException(
            f"{feature_label or 'This feature'} is not available on your current plan"
        )
    else:
        print("undu")


def raise_if_limit_exceeded(
    workspace,
    limit_field: str,
    current_count: int,
    resource_label: str = None,
    error_message: str = None,
):
    """Use inside services before creating a new resource — raises directly."""
    if not check_is_within_limit(workspace, limit_field, current_count):
        raise PlanLimitExceededException(
            error_message
            or f"You've reached your plan's limit for {resource_label or 'this resource'}"
        )
