export const sortCurrentUserToFirst = (members, currentUser) => {
    if (!currentUser || !members) return members
    return [...members].sort((a, b) => {
        if (a.userId === currentUser.id) return -1
        if (b.userId === currentUser.id) return 1
        return 0
    })
}


