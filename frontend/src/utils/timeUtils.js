import { formatDistanceToNow } from "date-fns"


export const formatTimeAgo = (dateTime) => {
    if(!dateTime) return ""
    const distance = formatDistanceToNow(new Date(dateTime), {
        locale: {
            formatDistance: (token, count) => {
                const map = {
                    xMinutes: `${count}min`,
                    aboutXMinutes: `${count}min`,
                    xHours: `${count}h`,
                    aboutXHours: `${count}h`,
                    xDays: `${count}d`,
                    aboutXMonths: `${count}mo`,
                    xMonths: `${count}mo`,
                    aboutXYears: `${count}y`,
                    xYears: `${count}y`,
                    lessThanXMinutes: 'just now',
                    halfAMinute: 'just now',
                }
                return map[token] ?? `${count}`
            }
        }
    })

    return distance === 'just now' ? 'just now' : `${distance} ago`
}

export const formatDate = (date) => {
    //'2026-06-30') → "Jun 30, 2026"

    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })

}