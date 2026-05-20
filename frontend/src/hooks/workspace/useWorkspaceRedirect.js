import { useDispatch } from "react-redux";
import { workspaceService } from "../../services/workspaceService";
import { showApiError } from "../../utils/toast";
import { setWorkspaces } from "../../store/slices/workspaceSlice";
import { useNavigate } from "react-router-dom";
import { getWorkspaceRedirectPath } from "../../utils/routeUtils";


export default function useWorkspaceRedirect() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    return async () => {
        try {
            const res = await workspaceService.getMyWorkspaces()
            dispatch(setWorkspaces(res.data))


            const { workspaces, last_workspace } = res.data

            navigate(getWorkspaceRedirectPath(res.data))


        } catch (err) {
            showApiError(err)

        }
    }


}