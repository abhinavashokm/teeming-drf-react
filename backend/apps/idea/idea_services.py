from .models import Idea
from apps.workspace.helpers.workspace_helper import get_workspace_or_raise
from apps.goal.helpers.goal_helper import get_goal_or_raise
from .helpers.idea_helper import get_idea_or_raise
from .models import Idea, IdeaStatusHistory, IdeaAssignment
from django.db import transaction
from apps.notification import notification_services


def create_idea(created_by, workspace, goal_id, data):

    # ensure workspace exists
    workspace = get_workspace_or_raise(workspace_id=workspace.id)

    # ensure goal exists
    goal = get_goal_or_raise(workspace=workspace, goal_id=goal_id)

    created_idea = Idea.objects.create(
        created_by=created_by, workspace=workspace, goal=goal, **data
    )

    print("outsdie here broh")

    notification_services.notify_workspace_members(
        workspace=workspace,
        exclude_user=created_by,
        message=f'{created_by.full_name} created a new idea: "{created_idea.title}"',
    )

    return created_idea


def list_goal_ideas(workspace, goal_id):
    """list all ideas under a single goal"""

    goal = get_goal_or_raise(workspace=workspace, goal_id=goal_id)

    return Idea.objects.in_workspace(workspace).filter(goal=goal)


def get_idea(workspace, idea_id):
    return get_idea_or_raise(workspace=workspace, idea_id=idea_id)


def delete_idea(workspace, idea_id):
    idea = get_idea_or_raise(workspace=workspace, idea_id=idea_id)
    idea.soft_delete()
    return True


def move_idea_to_progress(current_user, workspace, idea_id, assignees, deadline):
    """
    move idea to progress
    1] update idea
    2] add status change history
    3] assign members
    """

    with transaction.atomic():

        idea = get_idea_or_raise(
            workspace=workspace, idea_id=idea_id, select_for_update=True
        )
        previous_status = idea.status

        idea.status = Idea.StatusChoices.IN_PROGRESS
        if deadline:
            idea.deadline = deadline

        idea.save(update_fields=["status", "deadline"])

        IdeaStatusHistory.objects.create(
            workspace=workspace,
            idea=idea,
            changed_by=current_user,
            from_status=previous_status,
            to_status=Idea.StatusChoices.IN_PROGRESS,
        )

        IdeaAssignment.objects.bulk_create(
            [
                IdeaAssignment(
                    workspace=workspace,
                    idea=idea,
                    assigned_by=current_user,
                    assignee=assignee,
                )
                for assignee in assignees
            ]
        )

        return idea


def move_idea_to_done(current_user, workspace, idea_id, note):

    with transaction.atomic():

        idea = get_idea_or_raise(
            workspace=workspace, idea_id=idea_id, select_for_update=True
        )
        previous_status = idea.status
        idea.status = Idea.StatusChoices.DONE
        idea.save(update_fields=["status"])

        IdeaStatusHistory.objects.create(
            changed_by=current_user,
            workspace=workspace,
            idea=idea,
            from_status=previous_status,
            to_status=Idea.StatusChoices.DONE,
            note=note,
        )

        return idea
