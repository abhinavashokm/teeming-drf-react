export function handleFormError(error, setError) {
    const details = error.response?.data?.error?.details;

    if (!details) return false;

    Object.entries(details).forEach(([field, messages]) => {
        setError(field, {
            type: "server",
            message: messages[0],
        });
    });

    return true;
}