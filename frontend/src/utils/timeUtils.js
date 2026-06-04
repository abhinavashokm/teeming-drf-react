import { formatDistanceToNow } from "date-fns"


export const formatDateTime = (dateTime) => {
    return formatDistanceToNow(
        new Date(dateTime),
        { addSuffix: true }
    )
}

export const dateToHuman = (date) => {
    //'2026-06-30') → "Jun 30, 2026"

    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })

}