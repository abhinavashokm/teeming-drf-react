import { globalQueryKeys } from '../../constants/queryKeys'
import authService from '../../services/authService'
import useAppMutation from '../base/useAppMutation'

function useCompleteTour() {
  return useAppMutation({
    mutationFn: authService.completeTour,
    apiSuccessToast: false,
    invalidateKeys: [globalQueryKeys.auth],
  })
}

export default useCompleteTour