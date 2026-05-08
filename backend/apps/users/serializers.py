from rest_framework.serializers import ModelSerializer

from .models import User


class RegisterSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = '__all__'
    
    #manually call create user because modelserializer calls User.objects.create() which will not hash password
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
    