from rest_framework import serializers
from apps.user.models import User
from core.services import s3_service
from django.db.models import Count


class AdminUserListSerializer(serializers.ModelSerializer):
    workspace_count = serializers.IntegerField(read_only=True)
    status = serializers.SerializerMethodField()
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'full_name',
            'email',
            'avatar_key',
            'workspace_count',
            'is_active',
            'status',
            'is_staff',
            'created_at',
            'avatar_url',
        ]

    def get_status(self, obj):
        if not obj.is_active:
            return 'suspended'
        if obj.is_staff:
            return 'staff'
        return 'active'
    
    def get_avatar_url(self, obj):
        return s3_service.build_s3_url(obj.avatar_key)
    

class AdminUserWorkspaceSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    name = serializers.CharField()
    slug = serializers.CharField()
    role = serializers.SerializerMethodField()
    member_count = serializers.IntegerField()

    def get_role(self, obj):
        # obj is a Workspace annotated with the user's role
        return getattr(obj, 'user_role', None)
    

class AdminUserDetailSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()
    workspaces = serializers.SerializerMethodField()
    workspace_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'full_name',
            'email',
            'avatar_key',
            'status',
            'is_staff',
            'created_at',
            'workspace_count',
            'workspaces',
        ]

    def get_status(self, obj):
        if not obj.is_active:
            return 'suspended'
        if obj.is_staff:
            return 'staff'
        return 'active'

    def get_workspaces(self, obj):
        from apps.workspace.models import WorkspaceMember
        workspaces = (
            WorkspaceMember.objects
            .filter(user=obj)
            .select_related('workspace')
            .annotate(member_count=Count('workspace__members'))
        )
        return [
            {
                'id': str(m.workspace.id),
                'name': m.workspace.name,
                'slug': m.workspace.slug,
                'role': m.role,
                'memberCount': WorkspaceMember.objects.filter(workspace=m.workspace).count(),
            }
            for m in workspaces
        ]
    