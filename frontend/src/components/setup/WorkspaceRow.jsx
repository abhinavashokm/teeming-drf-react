import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { buildWorkspacePath } from '../../utils/routeUtils';

function WorkspaceRow({ workspace }) {
    const roleColors = {
        Owner: 'text-emerald-600 bg-emerald-50 border-emerald-100',
        Admin: 'text-blue-600 bg-blue-50 border-blue-100',
        Member: 'text-gray-500 bg-gray-50 border-gray-200'
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
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center text-white text-[16px] font-semibold shadow-sm shrink-0">
                    {workspace.name[0]}
                </div>

                <div className="flex flex-col min-w-0">
                    <h3 className="font-semibold text-gray-900 text-[16px] truncate mb-0.5">
                        {workspace.name}
                    </h3>

                    <span
                        className={`
                    inline-flex items-center px-2 py-0.5 rounded
                    text-[11px] font-medium border w-fit
                    ${roleColors[workspace.role] || roleColors.Member}
                `}
                    >
                        {workspace.role}
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