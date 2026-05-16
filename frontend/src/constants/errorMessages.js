import { errorCodes } from './errorCodes'

export const errorMessages = {
  [errorCodes.VALIDATION_ERROR]: null,
  [errorCodes.INVALID_CREDENTIALS]: 'Invalid email or password.',
  [errorCodes.ACCOUNT_NOT_FOUND]: 'No account found with this email.',
  [errorCodes.ACCOUNT_INACTIVE]: 'Your account is not active.',
  [errorCodes.REFRESH_TOKEN_INVALID]: 'Session expired. Please login again.',
  [errorCodes.OTP_EXPIRED]: 'OTP expired, please resend to continue!',
  [errorCodes.OTP_INVALID]: 'Invalid OTP. Please try again.',
  [errorCodes.SIGNUP_SESSION_EXPIRED]: 'Signup session expired. Please sign up again.',
  [errorCodes.UNKNOWN_ERROR]: 'Something went wrong. Please try again.',
}