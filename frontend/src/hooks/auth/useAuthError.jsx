import { useSelector } from "react-redux";
import { userFacingErrorCodes } from "../../constants/errorCodes";

export const useAuthError = () => {
    
    const authError = useSelector(store => store.auth.error)
  
    if (!authError) return null

    const displayError = userFacingErrorCodes.includes(authError?.code)
        ? authError.message
        : "Something went wrong!"

    return displayError

}