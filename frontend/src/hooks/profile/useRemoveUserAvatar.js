import { globalQueryKeys } from '../../constants/queryKeys'
import authService from '../../services/authService'
import useAppMutation from '../base/useAppMutation'


function useRemoveUserAvatar() {

    return useAppMutation({
        mutationFn: authService.removeProfilePic,
        invalidateKeys: [globalQueryKeys.auth],
        apiSuccessToast: false,
    })
}

export default useRemoveUserAvatar