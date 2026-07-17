import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { buildWorkspacePath } from '../../utils/routeUtils';
import WorkspaceAvatar from '../workspace/WorkspaceAvatar';
import {workspaceRoles} from "../../constants/workspaceConstants"

function WorkspaceRow({ workspace, role }) {
    const roleColors = {
        [workspaceRoles.OWNER]: 'text-emerald-600 bg-emerald-50 border-emerald-100',
        [workspaceRoles.ADMIN]: 'text-blue-600 bg-blue-50 border-blue-100',
        [workspaceRoles.MEMBER]: 'text-gray-500 bg-gray-50 border-gray-200'
    };

    const navigate = useNavigate()

    const selectWorkspace = () => {
        navigate(buildWorkspacePath(workspace.slug))
    }

    return (
        <div
            onClick={selectWorkspace}
            className="
        bg-white border border-gray-200 rounded-xl p-4
        hover:border-gray-300 hover:shadow-sm
        transition-all duration-200
        flex items-center justify-between
        group cursor-pointer
    "
        >
            <div className="flex items-center gap-4 min-w-0">
                <WorkspaceAvatar
                    workspace={workspace}
                    size="md"
                />

                <div className="flex flex-col min-w-0">
                    <h3 className="font-semibold text-gray-900 text-[16px] truncate mb-0.5">
                        {workspace.name}
                    </h3>

                    <span
                        className={`
                    inline-flex items-center px-2 py-0.5 rounded
                    text-[11px] font-medium border w-fit
                    ${roleColors[role] || roleColors.Member}
                `}
                    >
                        {role}
                    </span>
                </div>
            </div>

            <ArrowRight
                className="
            h-4 w-4 text-gray-300
            group-hover:text-[#1D9E75]
            group-hover:translate-x-0.5
            transition-all shrink-0
        "
            />
        </div>
    )
}

export default WorkspaceRow