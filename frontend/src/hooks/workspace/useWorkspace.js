import { useQuery } from "@tanstack/react-query";
import { workspaceService } from "../../services/workspaceService";
import useAuth from "../auth/useAuth";
import useWorkspaceQueryKeys from "../helper/useWorkspaceQueryKeys";
import useWorkspaceSlug from "./useWorkspaceSlug";


export default function useWorkspace() {

  const workspaceSlug = useWorkspaceSlug();
  const { data: user } = useAuth()
  const workspaceKeys = useWorkspaceQueryKeys()

  return useQuery({

    queryKey: workspaceKeys.root,

    queryFn: async () => {

      const res = await workspaceService.fetchWorkspaceBySlug(workspaceSlug);
      return res.data;

    },
    enabled: !!user && !!workspaceSlug

  });
}