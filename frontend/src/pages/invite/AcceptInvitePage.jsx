import React, { useEffect, useState, useRef } from "react";
import SetupHeader from "../../components/setup/SetupHeader";
import useResolveInvitation from "../../hooks/invite/useResolveInvitation";
import { renderContent } from "./RenderContent";
import FullPageLoader from "../../components/ui/FullPageLoader"
import { useNavigate, useSearchParams } from "react-router-dom";


const AcceptInvitationPage = () => {
  // --- State Configuration ---
  // 1: Logged in, correct email
  // 2: Logged in, wrong email
  // 3: Not logged in, has account
  // 4: Not logged in, no account


  const { data: invitationDetails, isPending, isSuccess } = useResolveInvitation()
  const navigate = useNavigate()

  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [currentState, setCurrentState] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [fade, setFade] = useState(true);

  const dropdownRef = useRef(null);

  const inviteEmail = "john@example.com";
  const loggedInWrongEmail = "user@example.com";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setFade(false);

    const timer = setTimeout(() => {
      setFade(true);
    }, 250);

    return () => clearTimeout(timer);
  }, [currentState]);


  const handleInvitationSignup = () => {
    navigate(`/auth/signup?token=${token}`)
  }


  if (isPending) return <FullPageLoader />

  return (
    <>

      {/* Card */}
      <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-8 transition-all duration-300">
        {/* Avatar */}
        <div className="mb-5 flex justify-center items-center">
          <div className="w-[60px] h-[60px] bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 shadow-sm flex items-center justify-center text-2xl font-bold">
            {invitationDetails.workspace.name[0]}
          </div>
        </div>

        {/* Typography */}
        <div className="flex flex-col mb-8 text-center">
          <h1 className="text-gray-900 font-bold text-[22px] leading-tight mb-2">
            {invitationDetails.workspace.name}
          </h1>

          <p className="text-[15px] text-gray-600">
            Invited by:{" "}
            <span className="font-semibold text-gray-900">
              {invitationDetails.invitedBy}
            </span>
          </p>

          <p className="text-[14px] text-gray-400 mt-1">
            This invite was sent to{" "}
            <span className="text-gray-600">
              {invitationDetails.invitedEmail}
            </span>
          </p>
        </div>


        {/* Dynamic Content */}
        <div
          className={`w-full flex flex-col gap-4 transition-opacity duration-300 ${fade ? "opacity-100" : "opacity-0"
            }`}
        >


          {/* case 4 */}
          <button onClick={handleInvitationSignup} className="w-full py-3 mt-1 bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors flex flex-col justify-center items-center gap-0.5">
            <span className="text-white font-bold text-[15px] leading-5">
              Create account
            </span>
            <span className="text-emerald-100 text-[13px] font-medium leading-4">
              {invitationDetails.invitedEmail}
            </span>
          </button>



        </div>


      </div>


      {/* Testing Controls */}
      {/* <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 flex flex-col gap-2 text-sm opacity-50 hover:opacity-100 transition-opacity">
        <div className="font-bold text-gray-500 mb-1 text-xs uppercase tracking-wider">
          Testing States
        </div>

        {[1, 2, 3, 4].map((state) => {
          const labels = {
            1: "Logged in, match",
            2: "Logged in, mismatch",
            3: "Not logged in, has acc",
            4: "Not logged in, no acc",
          };

          return (
            <button
              key={state}
              onClick={() => setCurrentState(state)}
              className={`text-left px-2 py-1.5 rounded transition-colors ${currentState === state
                ? "bg-gray-100 font-semibold text-emerald-600"
                : "hover:bg-gray-50"
                }`}
            >
              {state}. {labels[state]}
            </button>
          );
        })}
      </div> */}


    </>
  );
};

export default AcceptInvitationPage;