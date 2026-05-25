from django.urls import path, include


urlpatterns = [
    path('api/', include([
        path('auth/', include('apps.user.urls')),
        path('workspaces/', include('apps.workspace.urls')),
        path('workspaces/<slug:slug>/invitations/', include('apps.invitation.workspace_urls')),
        path('invitations/', include('apps.invitation.urls')),
        path('workspaces/<slug:slug>/goals/', include('apps.goal.urls')),
    ])),
]
