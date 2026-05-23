import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { workspaceService } from "../../services/workspaceService";
import useAuth from "../auth/useAuth";


export default function useWorkspace() {
  const { workspaceSlug } = useParams();
  const { data: user } = useAuth()

  return useQuery({

    queryKey: ['workspace', workspaceSlug],

    queryFn: async () => {

      const res = await workspaceService.fetchWorkspaceBySlug(workspaceSlug);
      return res.data;
    },
    enabled: !!user && !!workspaceSlug

  });
}