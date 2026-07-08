/**
 * DataTable.jsx — Reusable table shell for paginated admin lists
 *
 * Props:
 *   columns       {array}    [{ key, header, align?, className?, render(row, index) }]
 *   data          {array}    Row data
 *   rowKey        {function} (row) => unique key. Defaults to row.id
 *   isPending     {boolean}  Show skeleton rows
 *   isError       {boolean}  Show error row
 *   errorMessage  {string}   Message shown on error
 *   emptyMessage  {string}   Message shown when data is empty
 *   skeletonRows  {number}   Number of skeleton rows while loading (default 5)
 *   onRowClick    {function} (row) => void — optional row click handler
 *
 *   // Pagination (omit all of these to render the table without a pagination footer)
 *   currentPage   {number}
 *   totalPages    {number}
 *   totalCount    {number}
 *   hasNext       {boolean}
 *   hasPrevious   {boolean}
 *   onPageChange  {function} (nextPage: number) => void
 */

import Pagination from './Pagination';

function DataTable({
    columns,
    data = [],
    rowKey = (row) => row.id,
    isPending = false,
    isError = false,
    errorMessage = 'Failed to load data. Please try again.',
    emptyMessage = 'No results found.',
    skeletonRows = 5,
    onRowClick,

    currentPage,
    totalPages,
    totalCount,
    hasNext,
    hasPrevious,
    onPageChange,
}) {
    const showPagination = typeof onPageChange === 'function' && typeof totalPages === 'number';

    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={`px-6 py-3.5 text-[12px] font-bold text-slate-500 uppercase tracking-wider ${col.align === 'right' ? 'text-right' : ''
                                        } ${col.className ?? ''}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isPending ? (
                            [...Array(skeletonRows)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    {columns.map((col) => (
                                        <td key={col.key} className="px-6 py-4">
                                            <div className="h-4 bg-slate-100 rounded w-24" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : isError ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-8 text-center text-red-500 text-sm">
                                    {errorMessage}
                                </td>
                            </tr>
                        ) : data.length > 0 ? (
                            data.map((row, index) => (
                                <tr
                                    key={rowKey(row)}
                                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                                    className={`hover:bg-slate-50/50 transition-colors group ${onRowClick ? 'cursor-pointer' : ''}`}
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={col.key}
                                            className={`px-6 py-4 ${col.align === 'right' ? 'text-right relative' : ''} ${col.className ?? ''}`}
                                        >
                                            {col.render(row, index)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-8 text-center text-slate-500 text-sm">
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showPagination && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalCount={totalCount}
                    itemsShown={data.length}
                    hasNext={hasNext}
                    hasPrevious={hasPrevious}
                    onPageChange={onPageChange}
                />
            )}
        </div>
    );
}

export default DataTable;