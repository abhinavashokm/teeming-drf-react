import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { setCurrentWorkspace, setRole } from "../../store/slices/workspaceSlice";
import { useQuery } from "@tanstack/react-query";
import { workspaceService } from "../../services/workspaceService";
import useInitializeAuth from "../auth/useInitializeAuth";


export default function useInitializeWorkspace() {
  const { workspaceSlug } = useParams();
  const dispatch = useDispatch();
  const { data: user } = useInitializeAuth()

  return useQuery({

    queryKey: ['workspaceInitialize', workspaceSlug],

    queryFn: async () => {

      const res = await workspaceService.getWorkspace(workspaceSlug);
      // dispatch(setCurrentWorkspace(res.data.workspace));
      // dispatch(setRole(res.data.role));
      return res.data;
    },
    enabled: !!user && !!workspaceSlug

  });
}