from rest_framework import serializers
from .models import Workspace


class CreateWorkspaceSerilaizer(serializers.ModelSerializer):
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Workspace
        fields = ["name", "slug", "owner"]