from rest_framework import serializers

from .models import Idea, IdeaAssignment, IdeaStatusHistory
from apps.user.serializers import UserBasicSerializer
from apps.user.models import User
from apps.goal.serializers import GoalBasicSerializer


class WriteIdeaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Idea
        fields = (
            "title",
            "description",
        )
        extra_kwargs = {
            "description": {"required": False},
        }


class IdeaAssignmentSerializer(serializers.ModelSerializer):
    assignee = UserBasicSerializer(read_only=True)

    class Meta:
        model = IdeaAssignment
        fields = ["assignee"]


class IdeaReadSerializer(serializers.ModelSerializer):
    created_by = UserBasicSerializer(read_only=True)

    assignees = serializers.SerializerMethodField()

    assigned_by = serializers.SerializerMethodField()

    moved_to_planned_by = UserBasicSerializer(
        source="move_to_planned_history.changed_by", read_only=True, allow_null=True
    )
    moved_to_planned_at = serializers.DateTimeField(
        source="move_to_planned_history.created_at", read_only=True, allow_null=True
    )
    moved_to_progress_by = UserBasicSerializer(
        source="moved_to_progress_history.changed_by", read_only=True, allow_null=True
    )
    moved_to_progress_at = serializers.DateTimeField(
        source="moved_to_progress_history.created_at", read_only=True, allow_null=True
    )
    moved_to_done_by = UserBasicSerializer(
        source="moved_to_done_history.changed_by", read_only=True, allow_null=True
    )
    moved_to_done_at = serializers.DateTimeField(
        source="moved_to_done_history.created_at", read_only=True, allow_null=True
    )
    completion_note = serializers.CharField(
        source="moved_to_done_history.note", read_only=True, allow_null=True
    )
    goal = GoalBasicSerializer()

    class Meta:
        model = Idea
        fields = (
            "id",
            "title",
            "description",
            "deadline",
            "created_by",
            "status",
            "created_at",
            "assignees",
            "assigned_by",
            "moved_to_planned_by",
            "moved_to_planned_at",
            "moved_to_progress_by",
            "moved_to_progress_at",
            "moved_to_done_by",
            "moved_to_done_at",
            "completion_note",
            "goal",
        )

    def get_assigned_by(self, obj):
        assignment = obj.assignments.first()
        if assignment:
            return UserBasicSerializer(assignment.assigned_by).data
        return None

    def get_assignees(self, obj):
        return UserBasicSerializer(
            [assignment.assignee for assignment in obj.assignments.all()],
            many=True,
        ).data


class IdeaMoveToPlannedSerializer(serializers.Serializer):
    assignees = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        many=True,
    )
    deadline = serializers.DateField(required=False, allow_null=True)

    def validate_assignees(self, assignees):
        idea_id = self.context["idea_id"]

        existing_assignee_ids = set(
            IdeaAssignment.objects.filter(
                idea_id=idea_id,
                assignee__in=assignees,
            ).values_list("assignee_id", flat=True)
        )

        if existing_assignee_ids:
            raise serializers.ValidationError(
                "One or more users are already assigned to this idea."
            )

        return assignees


# class IdeaMoveToProgressSerializer(serializers.Serializer):
#     assignees = serializers.PrimaryKeyRelatedField(
#         queryset=User.objects.all(),
#         many=True,
#     )
#     deadline = serializers.DateField(required=False, allow_null=True)

#     def validate_assignees(self, assignees):
#         idea_id = self.context["idea_id"]

#         existing_assignee_ids = set(
#             IdeaAssignment.objects.filter(
#                 idea_id=idea_id,
#                 assignee__in=assignees,
#             ).values_list("assignee_id", flat=True)
#         )

#         if existing_assignee_ids:
#             raise serializers.ValidationError(
#                 "One or more users are already assigned to this idea."
#             )

#         return assignees


class IdeaMoveToDoneSerializer(serializers.ModelSerializer):

    class Meta:
        model = IdeaStatusHistory
        fields = ["note"]
