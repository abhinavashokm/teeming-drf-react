from django.urls import path, include

urlpatterns = [
    path(
        "api/",
        include(
            [
                path("auth/", include("apps.user.urls")),
                path("invitations/", include("apps.invitation.public_urls")),
                path("workspaces/", include("apps.workspace.urls")),
                path(
                    "workspaces/<slug:slug>/",
                    include(
                        [
                            path(
                                "invitations/",
                                include("apps.invitation.workspace_urls"),
                            ),
                            path(
                                "goals/",
                                include("apps.goal.urls"),
                            ),
                            path(
                                "ideas/",
                                include("apps.idea.detail_urls"),
                            ),
                            path(
                                "goals/<uuid:goal_id>/ideas/",
                                include("apps.idea.list_urls"),
                            ),
                            path("goals/<uuid:goal_id>/outcome/", include("apps.outcome.list_urls")),
                            path("outcome/", include("apps.outcome.detail_urls")),
                            path("notifications/", include("apps.notification.urls")),
                            path("goals/<uuid:goal_id>/discussion/", include("apps.discussion.urls")),
                        ]
                    ),
                ),
            ]
        ),
    ),
]
