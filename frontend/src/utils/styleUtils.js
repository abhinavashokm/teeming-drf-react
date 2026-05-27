import { AVATAR_COLORS, GOAL_CARD_COLORS } from "../constants/uiColors"


export const getAvatarColor = (identifier) => {
    const index = identifier
        .split('')
        .reduce((acc, char) => acc + char.charCodeAt(0), 0) % AVATAR_COLORS.length
    return AVATAR_COLORS[index]
}

export const getGoalCardColorClass = (identifier) => {
    const index = identifier
        .split('')
        .reduce((acc, char) => acc + char.charCodeAt(0), 0) % GOAL_CARD_COLORS.length
    return GOAL_CARD_COLORS[index]
}