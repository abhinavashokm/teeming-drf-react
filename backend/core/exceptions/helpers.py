from core.exceptions.base import NotFoundException


def get_object_or_raise(
    model,
    workspace=None,
    error_message="Object not found",
    select_for_update=False,
    select_related=None,
    prefetch_related=None,
    **filters
):

    try:
        qs = model.objects.all()

        if workspace:
            qs = model.objects.in_workspace(workspace)

        # when using select for update the query must be inside a transaction block
        if select_for_update:
            return qs.select_for_update().get(**filters)

        if select_related:
            qs = qs.select_related(
                *select_related
            )  # usage -> select_related=["created_by", "goal"]

        if prefetch_related:
            qs = qs.prefetch_related(*prefetch_related)

        return qs.get(**filters)

    except model.DoesNotExist:
        raise NotFoundException(error_message)
