import { useSelector } from "react-redux";
import { errorMessages } from "../../constants/errorMessages";

export const useAuthErrorMsg = () => {

    const authError = useSelector(store => store.auth.error)

    if (!authError) return null

    const code = authError?.error?.code
    const details = authError?.error?.details

    // validation error — return field errors
    if (code === 'VALIDATION_ERROR' && details) {
        // get first field's first error message
        const firstField = Object.keys(details)[0]
        return details[firstField]?.[0] ?? errorMessages.UNKNOWN_ERROR
    }

    const safeErrorMessage = errorMessages[code] ?? errorMessages.UNKNOWN_ERROR
    return safeErrorMessage

}

