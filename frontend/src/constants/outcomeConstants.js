export const CHECKIN_STATUS = {
    MEASURING: 'measuring',
    PROMISING: 'promising',
    ACHIEVED: 'achieved',
    NOT_WORKING: 'not_working',
}

export const CHECKIN_STATUS_LABELS = {
    measuring: "Still Measuring",
    promising: "Looking Promising",
    achieved: "Goal Achieved",
    not_working: "Not Working",
};

export const UNIT_OPTIONS = [
    {
        value: "percentage",
        display: "Percentage (%)",
    },
    {
        value: "number",
        display: "Count (#)",
    },
    {
        value: "currency",
        display: "Currency (₹)",
    },
    {
        value: "hours",
        display: "Hours (hrs)",
    },
    {
        value: "days",
        display: "Days (d)",
    },
    {
        value: "minutes",
        display: "Minutes (min)",
    },
    {
        value: "score",
        display: "Score (Sc)",
    },
];


export const UNIT_SHORT_LABELS = {
    percentage: "%",
    number: "#",
    currency: "₹",
    hours: "hrs",
    days: "d",
    minutes: "min",
    score: "Sc",
};