import { useInfiniteQuery } from '@tanstack/react-query'
import { goalService } from '../../services/goalService'
import useWorkspaceQueryKeys from '../helper/useWorkspaceQueryKeys'
import useWorkspaceSlug from '../params/useWorkspaceSlug'

function useGoals() {
  const workspaceSlug = useWorkspaceSlug()
  const workspaceKeys = useWorkspaceQueryKeys()

  return useInfiniteQuery({
    queryKey: workspaceKeys.goals,

    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      const resData = await goalService.fetchAllGoals(
        workspaceSlug,
        pageParam
      )

      return resData.data
    },

    getNextPageParam: (lastPage) => {
      const nextUrl =
        lastPage.pagination.next

      if (!nextUrl) {
        return undefined
      }

      const url = new URL(nextUrl)

      return Number(
        url.searchParams.get("page")
      )
    },
  })
}

export default useGoals