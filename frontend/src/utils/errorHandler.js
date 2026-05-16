import { errorMessages } from "../constants/errorMessages"
import { errorCodes } from "../constants/errorCodes"


//fetch error message from error response or give fallback error message
export const getErrorMsg = (errorRes, fallbackError=errorMessages.UNKNOWN_ERROR) => {
    const error = errorRes?.response?.data?.error ?? errorRes.error

    // if (!error) return null

    const code = error?.code
    const message = error?.message
    const details = error?.details

    // validation error — return field errors
    if (code === 'VALIDATION_ERROR' && details) {
        // get first field's first error message
        const firstField = Object.keys(details)[0]
        return details[firstField]?.[0] ?? fallbackError
    }

    const safeErrorMessage =  message ?? errorMessages[code] ?? fallbackError
    return safeErrorMessage
}


//fetch error code from error response or return fallback error code
export const getErrorCode = (errorRes) => {
    const error = errorRes?.response?.data?.error

    const code = error?.code
    return code ?? errorCodes.UNKNOWN_ERROR
}

