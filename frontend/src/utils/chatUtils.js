import { CHAT_ITEM_TYPES } from "../constants/chatConstants";

export function buildChatTimeline(messages = []) {
    return messages.flatMap((message, index) => {
        const currentDate = new Date(message.createdAt).toDateString();
        const previousDate =
            index > 0
                ? new Date(messages[index - 1].createdAt).toDateString()
                : null;

        const items = [];

        if (currentDate !== previousDate) {
            items.push({
                type: CHAT_ITEM_TYPES.DATE_DIVIDER,
                date: new Date(message.createdAt),
            });
        }

        items.push({
            type: CHAT_ITEM_TYPES.MESSAGE,
            message,
        });

        return items;
    });
}