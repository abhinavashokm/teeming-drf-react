import { useState, useRef } from "react";
import useAuth from "../../hooks/auth/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import useLogout from "../../hooks/auth/useLogout";


function SetupHeader() {

    const { mutate: logout } = useLogout()

    const [currentState, setCurrentState] = useState(1);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const queryClient = useQueryClient()
    const currentUser = queryClient.getQueryData(['auth'])
    const inviteEmail = currentUser?.email

    const handleLogout = () => {
        logout()
    }

    return currentUser && (
        <header
            className={`w-full flex justify-end items-center px-8 md:px-12 py-8 z-50 min-h-[100px] transition-opacity duration-300 ${currentState === 1 || currentState === 2
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
                }`}
        >
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsDropdownOpen((prev) => !prev);
                    }}
                    className="flex items-center gap-2 border border-gray-200 rounded-full py-1.5 px-3 pr-2 bg-white shadow-sm hover:shadow-md transition-all focus:outline-none"
                >
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold">
                        U
                    </div>

                    <span className="text-sm font-medium text-gray-900">
                        {currentState === 1
                            ? inviteEmail
                            : loggedInWrongEmail}
                    </span>

                    <svg
                        className="w-4 h-4 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>

                {isDropdownOpen && (
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                    >
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2.5 text-[14px] text-red-600 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                        >
                            Log out
                        </button>
                    </div>
                )}
            </div>
        </header>
    )
}

export default SetupHeader