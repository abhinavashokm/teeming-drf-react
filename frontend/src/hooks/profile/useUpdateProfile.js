import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { goalService } from '../../services/goalService'
import useWorkspaceSlug from '../workspace/useWorkspaceSlug'
import { showApiError, showApiSuccess } from '../../utils/toast'
import authService from '../../services/authService'
import useAppMutation from '../base/useAppMutation'

// function useUpdateProfile() {

//   const workspaceSlug = useWorkspaceSlug()
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: (data) => authService.updateUserProfile(data),
//     onSuccess: (res) => {
//       queryClient.invalidateQueries({
//         queryKey: ['auth']
//       })
//       showApiSuccess(res)
//     },
//     onError: (error) => {
//       showApiError(error)
//     }
//   })
// }


function useUpdateProfile() {

  const workspaceSlug = useWorkspaceSlug()

  return useAppMutation({
    mutationFn: (data) => authService.updateUserProfile(data),
    invalidateKeys: [['auth']]
  })
}

export default useUpdateProfile