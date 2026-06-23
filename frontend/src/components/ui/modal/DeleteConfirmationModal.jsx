import { useState } from "react";

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Workspace",
  description = "This action cannot be undone.",
  confirmationLabel = "Type the workspace slug to confirm",
  confirmationValue,         // the value user must type (e.g. workspace slug)
  confirmButtonText = "Delete",
  isLoading = false,
}) {
  const [inputValue, setInputValue] = useState("");

  if (!isOpen) return null;

  const handleClose = () => {
    setInputValue("");
    onClose();
  };

  const handleConfirm = () => {
    onConfirm();
    setInputValue("");
  };

  return (
    <div className="fixed inset-0 z-78 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-red-50">
              <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <h2 className="text-[15px] font-semibold text-gray-900">{title}</h2>
          </div>
          <p className="text-[13px] text-gray-500 ml-12">{description}</p>
        </div>

        {/* Confirmation input */}
        {confirmationValue && (
          <div className="px-6 pb-4">
            <label className="block text-[12px] font-medium text-gray-600 mb-1.5">
              {confirmationLabel}:{" "}
              <span className="font-semibold text-gray-800">{confirmationValue}</span>
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={confirmationValue}
              className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-[10px] outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all placeholder:text-gray-300"
            />
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 rounded-b-[16px]">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-[13px] font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-[10px] transition-colors shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={
              isLoading ||
              (confirmationValue ? inputValue !== confirmationValue : false)
            }
            className="px-4 py-2 text-[13px] font-medium text-white bg-red-600 hover:bg-red-700 rounded-[10px] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Deleting..." : confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}