from django.urls import path, include

urlpatterns = [
    path(
        "api/",
        include(
            [
                path("auth/", include("apps.user.urls")),
                path("workspaces/", include("apps.workspace.urls")),
                # invitations
                path(
                    "workspaces/<slug:slug>/invitations/",
                    include("apps.invitation.workspace_urls"),
                ),
                path("invitations/", include("apps.invitation.public_urls")),
                # goals
                path("workspaces/<slug:slug>/goals/", include("apps.goal.urls")),
                # ideas
                path("workspaces/<slug:slug>/ideas/", include("apps.idea.detail_urls")),
                path(
                    "workspaces/<slug:slug>/goals/<uuid:goal_id>/ideas/",
                    include("apps.idea.list_urls"),
                ),
            ]
        ),
    ),
]
