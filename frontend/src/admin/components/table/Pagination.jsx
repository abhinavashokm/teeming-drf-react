/**
 * Pagination.jsx — Reusable pagination control for paginated tables/lists
 *
 * Props:
 *   currentPage   {number}   Current page number (1-indexed)
 *   totalPages    {number}   Total number of pages
 *   totalCount    {number}   Total number of items across all pages
 *   itemsShown    {number}   Number of items rendered on the current page
 *   hasNext       {boolean}  Whether a next page exists
 *   hasPrevious   {boolean}  Whether a previous page exists
 *   onPageChange  {function} (nextPage: number) => void
 *   className     {string}   Extra classes on the wrapper
 */

function Pagination({
    currentPage,
    totalPages,
    totalCount,
    itemsShown,
    hasNext,
    hasPrevious,
    onPageChange,
    className = '',
}) {
    if (!totalPages || totalPages <= 0) return null;

    return (
        <div className={`px-6 py-4 border-t border-slate-200 flex items-center justify-between ${className}`}>
            <span className="text-[13px] text-slate-500">
                Showing {itemsShown} of {totalCount} entries
            </span>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={!hasPrevious}
                    className="px-3 py-1.5 border border-slate-200 rounded-md text-[13px] font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                >
                    Previous
                </button>
                <span className="px-3 py-1.5 bg-blue-600 border border-blue-600 rounded-md text-[13px] font-medium text-white">
                    {currentPage}
                </span>
                <span className="text-[13px] text-slate-400 px-1">of {totalPages}</span>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!hasNext}
                    className="px-3 py-1.5 border border-slate-200 rounded-md text-[13px] font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default Pagination;