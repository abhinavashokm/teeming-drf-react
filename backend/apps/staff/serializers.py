from rest_framework import serializers
from apps.user.models import User


class AdminUserListSerializer(serializers.ModelSerializer):
    workspace_count = serializers.IntegerField(read_only=True)
    status = serializers.SerializerMethodField()

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
        ]

    def get_status(self, obj):
        if not obj.is_active:
            return 'suspended'
        if obj.is_staff:
            return 'staff'
        return 'active'