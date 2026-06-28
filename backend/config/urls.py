from django.urls import path, include

urlpatterns = [
    path(
        "api/",
        include(
            [
                path("admin/", include('apps.staff.urls')),
                path("auth/", include("apps.user.urls")),
                path("invitations/", include("apps.invitation.public_urls")),
                path("workspaces/", include("apps.workspace.urls")),
                path("webhooks/", include("apps.subscription.webhook_urls")),
                path(
                    "workspaces/<slug:slug>/",
                    include(
                        [
                            path(
                                "invitations/",
                                include("apps.invitation.workspace_urls"),
                            ),
                            path(
                                "ideas/",
                                include("apps.idea.detail_urls"),
                            ),
                            path("outcome/", include("apps.outcome.detail_urls")),
                            path("notifications/", include("apps.notification.urls")),
                            path("subscriptions/", include("apps.subscription.user_urls")),
                            path("goals/", include("apps.goal.urls")),
                            path(
                                "goals/<uuid:goal_id>/",
                                include(
                                    [
                                        path("ideas/", include("apps.idea.list_urls")),
                                        path("outcome/",include("apps.outcome.list_urls")),
                                        path("discussion/",include("apps.discussion.urls")),
                                        path("ai/", include("apps.ai.urls")),
                                    ]
                                ),
                            ),
                        ]
                    ),
                ),
            ]
        ),
    ),
]
