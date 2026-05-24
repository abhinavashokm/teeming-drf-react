const AVATAR_COLORS = [
    { bg: 'bg-blue-100', text: 'text-blue-700' },
    { bg: 'bg-pink-100', text: 'text-pink-700' },
    { bg: 'bg-orange-100', text: 'text-orange-700' },
    { bg: 'bg-teal-100', text: 'text-teal-700' },
    { bg: 'bg-amber-100', text: 'text-amber-700' },
    { bg: 'bg-purple-100', text: 'text-purple-700' },
    { bg: 'bg-green-100', text: 'text-green-700' },
    { bg: 'bg-red-100', text: 'text-red-700' },
]

export const getAvatarColor = (identifier) => {
    const index = identifier
        .split('')
        .reduce((acc, char) => acc + char.charCodeAt(0), 0) % AVATAR_COLORS.length
    return AVATAR_COLORS[index]
}