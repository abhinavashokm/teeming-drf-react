import time
from django.conf import settings

from apps.workspace.models import Workspace
from apps.user.models import User
from apps.workspace.models import Workspace
from django.http import JsonResponse
from channels.middleware import BaseMiddleware
from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth.models import AnonymousUser

# Reserved routes that should not be treated as workspace slugs
# when using with /workspaces/<reserved_word>/
RESERVED_WORKSPACE_ROUTES = {
    "session",
}


class WorkspaceMiddleware:
    """tenant/workspace resolution from slug"""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):

        request.workspace = None

        path_parts = request.path.strip("/").split("/")
        # Example: /api/workspaces/acme/tasks/
        # => ["api", "workspaces", "acme", "tasks"]

        if len(path_parts) >= 3 and path_parts[1] == "workspaces":

            possible_slug = path_parts[2]

            if possible_slug not in RESERVED_WORKSPACE_ROUTES:

                try:
                    workspace = Workspace.objects.get(slug=possible_slug)

                    request.workspace = workspace

                except Workspace.DoesNotExist:

                    return JsonResponse(
                        {
                            "success": False,
                            "error": {
                                "message": "Workspace not found",
                                "code": "WORKSPACE_NOT_FOUND",
                            },
                        },
                        status=404,
                    )

        response = self.get_response(request)

        return response
    

@database_sync_to_async
def get_user_from_token(token_key):
    try:
        token = AccessToken(token_key)
        user = User.objects.get(id=token["user_id"])
        print("✅ WebSocket user:", user)  # check terminal
        return user
    except Exception as e:
        print("❌ JWT error:", e)
        return AnonymousUser()


class JWTAuthMiddleware(BaseMiddleware):

    async def __call__(self, scope, receive, send):

        query_string = parse_qs(scope["query_string"].decode())
        token = query_string.get("token", [None])[0]
        scope["user"] = await get_user_from_token(token) if token else AnonymousUser()
        return await super().__call__(scope, receive, send)
    

@database_sync_to_async
def get_workspace_for_member(slug, user):
    try:
        return Workspace.objects.get(slug=slug, members__user=user)
    except Workspace.DoesNotExist:
        return None


class WebSocketWorkspaceMiddleware(BaseMiddleware):

    async def __call__(self, scope, receive, send):
        
        scope['workspace'] = None

        path = scope['path']
        parts = path.strip('/').split('/')

        if len(parts) >= 3 and parts[1] == 'workspaces':
            slug = parts[2]
            user = scope.get("user")

            if user and not user.is_anonymous:
                print("workspace middlware wroked!!!!!!!")
                scope['workspace'] = await get_workspace_for_member(slug, user)

        return await super().__call__(scope, receive, send)


class ResponseDelayMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        if settings.DEBUG_API_DELAY:
            time.sleep(0)

        return response