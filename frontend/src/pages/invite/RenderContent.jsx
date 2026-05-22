  export const renderContent = (currentState) => {
    if (currentState === 1) {
      //logged in match
      return (
        <button className="w-full py-[10px] bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors flex justify-center items-center">
          <span className="text-white font-bold text-[16px] leading-6">
            Accept Invitation
          </span>
        </button>
      );
    }
    //logged in mismatch
    if (currentState === 2) {
      return (
        <>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-1 flex gap-3 items-start shadow-sm">
            <svg
              className="w-5 h-5 text-amber-500 mt-0.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>

            <p className="text-[14px] text-amber-800 leading-snug">
              You are currently logged in as{" "}
              <span className="font-semibold">
                {loggedInWrongEmail}
              </span>
              , but this invite was sent to{" "}
              <span className="font-semibold">{inviteEmail}</span>.
            </p>
          </div>

          <button className="w-full py-[10px] bg-white border border-gray-200 hover:bg-gray-50 rounded-lg shadow-sm transition-colors flex justify-center items-center">
            <span className="text-gray-900 font-medium text-[16px] leading-6">
              Log out and continue as {inviteEmail}
            </span>
          </button>
        </>
      );
    }
    //not logged in, has account
    if (currentState === 3) {
      return (
        <button className="w-full py-[10px] mt-1 bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors flex justify-center items-center">
          <span className="text-white font-bold text-[16px] leading-6">
            Log in as {inviteEmail}
          </span>
        </button>
      );
    }
    //not logged in no account
    if (currentState === 4) {
      return (
        <button className="w-full py-[10px] mt-1 bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors flex justify-center items-center">
          <span className="text-white font-bold text-[16px] leading-6">
            Create account as {inviteEmail}
          </span>
        </button>
      );
    }
  };