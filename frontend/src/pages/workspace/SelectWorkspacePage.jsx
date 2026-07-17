import { ArrowRight, LayoutGrid, Plus } from 'lucide-react';
import usemyMemberships from '../../hooks/workspace/usemyMemberships';
import WorkspaceRow from '../../components/setup/WorkspaceRow';
import { Link, useOutletContext } from 'react-router-dom';
import { useEffect } from 'react';


function SelectWorkspacePage({ onEnterWorkspace, onCreateNewWorkspace }) {

    const { data: membershipData } = usemyMemberships()
    const { setCenterContent } = useOutletContext()

    const myMemberships = membershipData?.memberships

    //for removing vertical centering style of parent layout
    useEffect(() => {
        setCenterContent(false)

        return () => {
            setCenterContent(true)
        }
    }, [])

    return (
        <>
            {/* Header section */}
            <div className="w-full max-w-3xl flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">Select a Workspace</h1>
                    <p className="text-[15px] text-gray-500">Choose a workspace to continue or create a new one.</p>
                </div>
                <Link to={'/create-workspace'} className="text-[14px] font-medium text-white bg-[#1D9E75] hover:bg-[#15825f] transition-colors flex items-center gap-1.5 px-4 py-2 rounded-lg shadow-sm">
                    <Plus className="h-4 w-4" strokeWidth={2} />
                    Create new workspace
                </Link>
            </div>

            {/* Workspaces List */}
            {myMemberships?.length > 0 ? (
                <div className="w-full max-w-3xl flex flex-col gap-3">
                    {myMemberships?.map(membership => (
                        <WorkspaceRow key={membership.workspace.id} workspace={membership.workspace} role={membership.role} />
                    ))}
                </div>
            ) : (
                <div className="w-full max-w-3xl bg-white border border-gray-200 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                        <LayoutGrid className="w-8 h-8 text-gray-400" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-[16px] font-semibold text-gray-900 mb-1">No workspaces yet</h3>
                    <p className="text-[14px] text-gray-500 mb-6 max-w-sm">
                        You haven't joined any workspaces yet. Create a new one to get started.
                    </p>
                </div>
            )}

        </>
    )
}

export default SelectWorkspacePage