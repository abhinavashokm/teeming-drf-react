import toast from 'react-hot-toast'
import { getErrorMsg, getSuccessMsg } from './apiParser.js'

export const showSuccess = (message) => toast.success(message)
export const showError = (message) => toast.error(message)
export const showLoading = (message) => toast.loading(message)
export const showApiError = (error) => showError(getErrorMsg(error))
export const showApiSuccess = (successRes) => showSuccess(getSuccessMsg(successRes))