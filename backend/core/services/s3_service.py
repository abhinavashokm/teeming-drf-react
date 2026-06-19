import boto3

from uuid import uuid4
from django.conf import settings


class S3Service:

    @staticmethod
    def get_client():
        return boto3.client(
            "s3",
            region_name=settings.AWS_S3_REGION_NAME,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        )
    
    @classmethod
    def generate_workspace_logo_upload_url(cls, workspace, content_type):
        client = cls.get_client()

        key = (
            f"workspaces/"
            f"{workspace.slug}/"
            f"logo/"
            f"logo.png"
        )

        url = client.generate_presigned_url(
            ClientMethod="put_object",
            Params={
                "Bucket": settings.AWS_STORAGE_BUCKET_NAME,
                "Key": key,
                "ContentType": content_type,
            },
            ExpiresIn=300,
        )

        return {
            "upload_url": url,
            "file_key": key,
        }