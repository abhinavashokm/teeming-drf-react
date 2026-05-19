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
            const res_data = await workspaceService.getMyWorkspaces()
            dispatch(setWorkspaces(res_data.data))
            console.log(res_data.data)

            const { workspaces, last_workspace } = res_data.data

            navigate(getWorkspaceRedirectPath(res_data.data))


        } catch (err) {
            showApiError(err)

        }
    }


}