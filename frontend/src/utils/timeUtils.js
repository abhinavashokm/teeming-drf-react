import { formatDistanceToNow } from "date-fns"


export const formatDateTime = (dateTime) => {
    return formatDistanceToNow(
        new Date(dateTime),
        { addSuffix: true }
    )
}
