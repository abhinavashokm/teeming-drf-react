from core.exceptions.base import NotFoundException


def get_object_or_raise(model, workspace, error_message="Object not found", **filters):

    try:
        return model.objects.in_workspace(workspace).get(**filters)

    except model.DoesNotExist:
        raise NotFoundException(error_message)