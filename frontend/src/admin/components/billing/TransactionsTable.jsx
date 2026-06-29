import React, { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import useTransactions from "../../hooks/adminBilling/useTransactions";

const PLAN_BADGE = {
  Enterprise: "bg-purple-100 text-purple-700",
  Pro: "bg-blue-100 text-blue-700",
};

const TYPE_BADGE = {
  payment: "bg-emerald-100 text-emerald-700",
  renewal: "bg-blue-100 text-blue-700",
  upgrade: "bg-violet-100 text-violet-700",
  downgrade: "bg-amber-100 text-amber-700",
};

export default function TransactionsTable() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // debounce search so we don't refetch on every keystroke
  React.useEffect(() => {
    const id = setTimeout(() => {
      setSearch(searchInput);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(id);
  }, [searchInput]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [monthFilter, yearFilter]);

  const { data: transactions = [], isLoading, isError, error } = useTransactions({
    search,
    year: yearFilter,
    month: monthFilter,
  });

  const totalPages = Math.ceil(transactions.length / itemsPerPage) || 1;

  const paginatedTransactions = useMemo(
    () =>
      transactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [transactions, currentPage]
  );

  const formatAmount = (amount, currency) =>
    `${currency} ${Number(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
    })}`;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mt-6">
      <div className="p-5 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h3 className="text-[16px] font-bold text-slate-900">Recent Transactions</h3>
          <p className="text-[13px] text-slate-500 mt-1">Full transaction log</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Year Filter */}
          <div className="relative">
            <button
              onClick={() => { setIsYearOpen(!isYearOpen); setIsMonthOpen(false); }}
              className="flex items-center justify-between w-[110px] h-[36px] bg-white border border-slate-200 rounded-lg px-3 text-[13px] font-medium text-slate-700 shadow-sm"
            >
              {yearFilter === "all" ? "All Years" : yearFilter}
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
            {isYearOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsYearOpen(false)} />
                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1">
                  {["all", "2025", "2024"].map((year) => (
                    <button
                      key={year}
                      onClick={() => { setYearFilter(year); setIsYearOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 text-[13px] ${
                        yearFilter === year ? "bg-blue-50 text-blue-700 font-bold" : "hover:bg-slate-50"
                      }`}
                    >
                      {year === "all" ? "All Years" : year}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Month Filter — value sent to backend is 1-12, "all" for none */}
          <div className="relative">
            <button
              onClick={() => { setIsMonthOpen(!isMonthOpen); setIsYearOpen(false); }}
              className="flex items-center justify-between w-[120px] h-[36px] bg-white border border-slate-200 rounded-lg px-3 text-[13px] font-medium text-slate-700 shadow-sm"
            >
              {monthFilter === "all" ? "All Months" : MONTH_NAMES[monthFilter]}
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
            {isMonthOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsMonthOpen(false)} />
                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1 max-h-48 overflow-y-auto">
                  <button
                    onClick={() => { setMonthFilter("all"); setIsMonthOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-[13px] ${
                      monthFilter === "all" ? "bg-blue-50 text-blue-700 font-bold" : "hover:bg-slate-50"
                    }`}
                  >
                    All Months
                  </button>
                  {Object.entries(MONTH_NAMES).map(([num, label]) => (
                    <button
                      key={num}
                      onClick={() => { setMonthFilter(num); setIsMonthOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 text-[13px] ${
                        monthFilter === num ? "bg-blue-50 text-blue-700 font-bold" : "hover:bg-slate-50"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Search */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search workspace..."
              className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 text-[13px]"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {["Workspace", "Owner", "Plan", "Amount", "Type", "Date", "Invoice"].map((heading) => (
                <th key={heading} className="px-6 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-500">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-sm text-slate-500">
                  Loading transactions...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-sm text-red-500">
                  Failed to load transactions{error?.message ? `: ${error.message}` : "."}
                </td>
              </tr>
            ) : paginatedTransactions.length ? (
              paginatedTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-bold">{tx.workspace.name}</td>
                  <td className="px-6 py-4 text-slate-600">{tx.workspace.ownerEmail}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase ${
                      PLAN_BADGE[tx.plan.name] || "bg-slate-200 text-slate-700"
                    }`}>
                      {tx.plan.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold">{formatAmount(tx.amount, tx.currency)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase ${
                      TYPE_BADGE[tx.type] || "bg-slate-200 text-slate-700"
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{tx.date}</td>
                  <td className="px-6 py-4">
                    {tx.invoiceUrl && (
                      <a href={tx.invoiceUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-[13px]">
                        View
                      </a>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-8 text-sm text-slate-500">
                  No transactions found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
        <span className="text-[13px] text-slate-500">
          Showing {paginatedTransactions.length ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
          {Math.min(currentPage * itemsPerPage, transactions.length)} of {transactions.length} transactions
        </span>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
            className="p-1.5 border rounded-md disabled:opacity-50">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[13px]">Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
            className="p-1.5 border rounded-md disabled:opacity-50">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

const MONTH_NAMES = {
  "1": "Jan", "2": "Feb", "3": "Mar", "4": "Apr", "5": "May", "6": "Jun",
  "7": "Jul", "8": "Aug", "9": "Sep", "10": "Oct", "11": "Nov", "12": "Dec",
};