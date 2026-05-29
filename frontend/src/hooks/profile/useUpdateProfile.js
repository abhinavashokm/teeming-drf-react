import { globalQueryKeys } from '../../constants/queryKeys'
import authService from '../../services/authService'
import useAppMutation from '../base/useAppMutation'


function useUpdateProfile() {

  return useAppMutation({
    mutationFn: authService.updateUserProfile,
    invalidateKeys: [globalQueryKeys.auth]
  })
  
}

export default useUpdateProfile