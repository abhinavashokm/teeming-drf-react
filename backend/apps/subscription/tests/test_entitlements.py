from django.test import TestCase
from django.contrib.auth import get_user_model

from ..models import Plan, WorkspaceSubscription
from apps.workspace.models import Workspace
from ..services import entitlements
from ..constants import Features
from ..helpers.subscription_helper import get_free_plan

User = get_user_model()


class CheckHasFeatureTests(TestCase):

    def setUp(self):
        """
        Runs before EVERY test method below. Use it for setup that's
        common to all tests in this class, so you don't repeat yourself.
        """
        self.user = User.objects.create_user(
            email="owner@test.com",
            password="testpass123",
        )
        self.workspace = Workspace.objects.create(
            name="Test Workspace",
            slug="test-ws",
            owner=self.user,
        )

    def test_free_plan_with_feature_manually_disabled_returns_false(self):
        # Arrange: admin explicitly turns the feature off on the real
        # seeded free plan — this is the plan the workspace already has
        # via its auto-created subscription
        free_plan = get_free_plan()
        free_plan.can_use_ai_assistant = False
        free_plan.save()

        # Act
        result = entitlements.check_has_feature(self.workspace, Features.AI_ASSISTANT)

        # Assert
        self.assertFalse(result)

    def test_free_plan_with_feature_manually_enabled_returns_true(self):
        # Arrange: admin manually flips the feature on for the free plan
        # (features are admin-controlled per plan, not hardcoded to a tier)
        free_plan = get_free_plan()
        free_plan.can_use_ai_assistant = True
        free_plan.save()

        # Act
        result = entitlements.check_has_feature(self.workspace, Features.AI_ASSISTANT)

        # Assert
        self.assertTrue(result)

    def test_returns_true_when_pro_plan_has_feature_enabled(self):
        # Arrange: create a distinct Pro plan (unique code, won't collide
        # with the auto-seeded free plan) and move the workspace onto it
        pro_plan = Plan.objects.create(
            code="pro",
            name="Pro",
            can_use_ai_assistant=True,
            tier=5,
        )
        subscription = entitlements.get_current_subscription(workspace=self.workspace)
        subscription.plan = pro_plan
        subscription.save()

        # Act
        result = entitlements.check_has_feature(self.workspace, Features.AI_ASSISTANT)

        # Assert
        self.assertTrue(result)