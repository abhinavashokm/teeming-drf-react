from apps.workspace.models import Workspace
from django.http import JsonResponse

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
