import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { setAccessToken } from "../../store/slices/authSlice";
import { globalQueryKeys } from "../../constants/queryKeys";
import { buildWorkspacePath } from "../../utils/routeUtils";

import useWelcomeBanner from "../invite/useWelcomeBanner";
import useWorkspaceRedirect from "../routes/useWorkspaceRedirect";

export default function useAuthSuccess() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate: redirectToWorkspace } = useWorkspaceRedirect()
    const { setWelcome } = useWelcomeBanner();

    const handleAuthSuccess = (data) => {

        dispatch(setAccessToken(data.accessToken));

        queryClient.setQueryData(globalQueryKeys.auth, data.user);

         //if user joined a workspace using invite token, store workspace deatils for showing welcome banner
        if (data.joinedWorkspace) {
            setWelcome(data.joinedWorkspace.slug, data.user.id);
        }

        if (data.user.lastWorkspace) {
            navigate(buildWorkspacePath(data.user.lastWorkspace.slug));
        } else {
            redirectToWorkspace();
        }
    };

    return handleAuthSuccess;
}