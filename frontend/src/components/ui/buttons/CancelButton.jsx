
function CancelButton({ children, onClick }) {
    return (
        <button
            onClick={onClick}
            className="text-[13px] font-medium px-5 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 min-h-[44px] w-full sm:w-auto text-gray-700 transition-colors shadow-sm"
        >
            {children || "Cancel"}
        </button>
    )
}

export default CancelButton