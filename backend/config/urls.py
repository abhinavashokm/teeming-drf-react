from django.urls import path, include


urlpatterns = [
    path('api/', include([
        path('auth/', include('apps.users.urls')),
        path('workspaces/', include('apps.workspace.urls')),
        path('workspaces/<slug:slug>/invitations/', include('apps.invitation.workspace_urls')),
        path('invitations/', include('apps.invitation.urls')),
    ])),
]
