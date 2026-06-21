import boto3

from django.conf import settings


def build_s3_url(file_key):

    if not file_key:
        return None

    return (
        f"https://{settings.AWS_STORAGE_BUCKET_NAME}"
        f".s3.{settings.AWS_S3_REGION_NAME}"
        f".amazonaws.com/"
        f"{file_key}"
        )


def _get_client():
    return boto3.client(
        "s3",
        region_name=settings.AWS_S3_REGION_NAME,
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    )


def generate_workspace_logo_upload_url(workspace, content_type):
    client = _get_client()

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


def generate_user_avatar_upload_url(user, content_type):
    client = _get_client()

    key = (
        f"users/"
        f"{user.email}/"
        f"avatar/"
        f"avatar.png"
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