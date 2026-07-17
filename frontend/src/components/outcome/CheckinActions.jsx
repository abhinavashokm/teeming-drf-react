import { MoreHorizontal, Pencil, Trash2, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import useDeleteCheckin from "../../hooks/outcome/useDeleteCheckin";
import DangerConfirmationModal from "../ui/modal/DangerConfirmationModal";


export default function CheckinActions({
    onEdit,
    onDelete,
    checkin,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
    }, []);

    /* -------------------------------------------------------------------------- */
    /* delete checkin */
    /* -------------------------------------------------------------------------- */
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
    const { mutate: deleteCheckin, isPending: isDeleting } = useDeleteCheckin()

    const handleDeleteCheckin = () => {
        deleteCheckin(checkin.id, {
            onSuccess: () => setIsOpen(false)
        })
    }

    return (
        <div
            ref={menuRef}
            className="relative"
        >
            <button
                onClick={() => setIsOpen(prev => !prev)}
                disabled={isDeleting}
                className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
            >
                <MoreHorizontal className="w-4 h-4 text-gray-500" />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full  w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            onEdit();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-50"
                    >
                        <Pencil className="w-4 h-4" />
                        Edit
                    </button>

                    <button
                        onClick={() => setIsDeleteConfirmOpen(true)}
                        disabled={isDeleting}
                        className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </>
                        )}
                    </button>
                </div>
            )}

            <DangerConfirmationModal
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirm={handleDeleteCheckin}
                title="Delete Checkin"
                isLoading={isDeleting}
            />

        </div>
    );
}