from core.exceptions.base import NotFoundException


def get_object_or_raise(model, workspace, error_message="Object not found", select_for_update=False, **filters):

    try:
        if select_for_update:
            #when using select for update the query must be inside a transaction block
            return model.objects.in_workspace(workspace).select_for_update().get(**filters)
        
        return model.objects.in_workspace(workspace).get(**filters)

    except model.DoesNotExist:
        raise NotFoundException(error_message)