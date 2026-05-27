import { can } from "../../utils/permissions";
import useWorkspace from "../workspace/useWorkspace";

//return if the current user role have the permission to perform a action 
export const useCan = (permission) => {
    const { data: workspace } = useWorkspace()
    return can(workspace?.role, permission)
}