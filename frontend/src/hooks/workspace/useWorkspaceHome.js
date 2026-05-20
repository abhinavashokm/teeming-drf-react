import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { workspaceService } from "../../services/workspaceService";

export default function useWorkspaceHome() {
    const {workspaceSlug} = useParams()

    return useQuery({
        'queryKey': ['workspace', workspaceSlug],
        'queryFn': async() => {

            const res = await workspaceService.getWorkspaceHome(workspaceSlug)
            return res.data
        },
    })
}