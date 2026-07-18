from apps.workspace.helpers.workspace_helper import get_workspace_or_raise
from apps.goal.helpers.goal_helper import get_goal_or_raise
from .helpers.idea_helper import get_idea_or_raise
from .models import Idea, IdeaStatusHistory, IdeaAssignment, IdeaLike
from django.db import transaction
from apps.notification import notification_services
from django.db.models import Count, Exists, OuterRef


def create_idea(created_by, workspace, goal_id, data):

    # ensure workspace exists
    workspace = get_workspace_or_raise(workspace_id=workspace.id)

    # ensure goal exists
    goal = get_goal_or_raise(workspace=workspace, goal_id=goal_id)

    created_idea = Idea.objects.create(
        created_by=created_by, workspace=workspace, goal=goal, **data
    )

    notification_services.notify_workspace_members(
        workspace=workspace,
        exclude_user=created_by,
        message=f'{created_by.full_name} created a new idea: "{created_idea.title}" in goal "{created_idea.goal.name}',
        target_id=created_idea.goal.id,
    )

    return created_idea


def list_goal_ideas(current_user, workspace, goal_id):
    """list all ideas under a single goal"""

    goal = get_goal_or_raise(workspace=workspace, goal_id=goal_id)

    return (
        Idea.objects.in_workspace(workspace)
        .filter(goal=goal)
        .annotate(
            like_count=Count("likes", distinct=True),
            is_liked=Exists(
                IdeaLike.objects.filter(idea=OuterRef("pk"), user=current_user)
            ),
        )
        .select_related("created_by")
        .order_by('-like_count', '-created_at')
    )


def get_idea(workspace, idea_id):
    return get_idea_or_raise(workspace=workspace, idea_id=idea_id)


def delete_idea(workspace, idea_id):
    idea = get_idea_or_raise(workspace=workspace, idea_id=idea_id)
    idea.soft_delete()
    return True


@transaction.atomic
def move_idea_to_planned(current_user, workspace, idea_id, assignees, deadline):
    """
    move idea to progress
    1] update idea
    2] add status change history
    3] assign members
    """

    idea = get_idea_or_raise(
        workspace=workspace, idea_id=idea_id, select_for_update=True
    )
    previous_status = idea.status

    idea.status = Idea.StatusChoices.PLANNED
    if deadline:
        idea.deadline = deadline

    idea.save(update_fields=["status", "deadline"])

    IdeaStatusHistory.objects.create(
        workspace=workspace,
        idea=idea,
        changed_by=current_user,
        from_status=previous_status,
        to_status=Idea.StatusChoices.PLANNED,
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

    # notify the creator
    notification_services.notify_users(
        workspace=workspace,
        exclude_user=current_user,
        message=f'Idea you created "{idea.title}" in "{idea.goal.name}" is moved to planned',
        users=[idea.created_by],
        target_id=idea.goal.id,
    )

    # notify the assigned members
    notification_services.notify_users(
        workspace=workspace,
        exclude_user=current_user,
        message=f'You were assigned to "{idea.title}" in goal "{idea.goal.name}" by {current_user.full_name}',
        users=assignees,
        target_id=idea.goal.id,
    )

    return idea


def move_idea_to_progress(current_user, workspace, idea_id):

    with transaction.atomic():

        idea = get_idea_or_raise(
            workspace=workspace, idea_id=idea_id, select_for_update=True
        )
        previous_status = idea.status

        idea.status = Idea.StatusChoices.IN_PROGRESS
        idea.save(update_fields=["status", "deadline"])

        IdeaStatusHistory.objects.create(
            workspace=workspace,
            idea=idea,
            changed_by=current_user,
            from_status=previous_status,
            to_status=Idea.StatusChoices.IN_PROGRESS,
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


def like_idea(current_user, workspace, idea_id):
    idea = get_idea_or_raise(workspace=workspace, idea_id=idea_id)
    _, created = IdeaLike.objects.get_or_create(idea=idea, user=current_user)
    return {"liked": True, "created": created}


def unlike_idea(current_user, workspace, idea_id):
    idea = get_idea_or_raise(workspace=workspace, idea_id=idea_id)
    deleted_count, _ = IdeaLike.objects.filter(idea=idea, user=current_user).delete()
    return {"liked": False, "deleted": deleted_count > 0}
