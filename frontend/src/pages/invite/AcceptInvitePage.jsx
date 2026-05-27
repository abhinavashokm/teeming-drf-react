import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import FullPageLoader from "../../components/ui/FullPageLoader";
import useAuth from "../../hooks/auth/useAuth";
import useLogout from "../../hooks/auth/useLogout";
import useAcceptInvitation from "../../hooks/invite/useAcceptInvitation";
import useInvitationToken from "../../hooks/invite/useInvitationToken";
import useResolveInvitation from "../../hooks/invite/useResolveInvitation";


const AcceptInvitationPage = () => {

  const { data: invitationDetails, isPending, isSuccess } = useResolveInvitation()
  const { data: currentUser } = useAuth()
  const { mutate: logout } = useLogout()
  const { mutate: acceptInvitation } = useAcceptInvitation()

  const navigate = useNavigate()

  const token = useInvitationToken()

  const [currentState, setCurrentState] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [fade, setFade] = useState(true);

  const dropdownRef = useRef(null);


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


  const getButtonLabel = () => {
    if (!currentUser) {
      return invitationDetails.accountExists ? "Login" : "Create Account"
    }
    if (currentUser.email === invitationDetails.invitedEmail) return "Accept Invitation"
    return "Log out and continue as"
  }


  const handleAcceptInvitation = () => {
    const sameEmail = currentUser?.email === invitationDetails.invitedEmail

    if (sameEmail) {
      acceptInvitation()
      return
    }

    // not logged in at all
    if (!currentUser) {
      navigate(invitationDetails.accountExists
        ? `/auth/login?token=${token}`
        : `/auth/signup?token=${token}`
      )
      return
    }

    // logged in but wrong email — logout first, then navigate
    logout(undefined, {
      onSuccess: () => {
        navigate(invitationDetails.accountExists
          ? `/auth/login?token=${token}`
          : `/auth/signup?token=${token}`
        )
      }
    })
  }


  if (isPending) return <FullPageLoader />

  return (
    <>

      {/* Card */}
      <div className="w-full max-w-[440px] bg-white border border-gray-200 rounded-xl shadow-sm p-8 transition-all duration-300">
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
          <div className="mt-4 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5">

              <div className="w-2 h-2 rounded-full bg-emerald-500" />

              <span className="text-[12px] font-medium text-emerald-700">
                Joining as
              </span>

              <span className="text-[12px] font-semibold text-emerald-900 capitalize">
                {invitationDetails.role}
              </span>

            </div>
          </div>

        </div>




        {/* Dynamic Content */}

        {/* email warning message */}
        {currentUser && currentUser?.email !== invitationDetails.invitedEmail && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-900">
              You’re signed in with a different account
            </p>

            <p className="mt-1 text-sm text-amber-700">
              This invitation was sent to{" "}
              <span className="font-medium">
                {invitationDetails.invitedEmail}
              </span>
            </p>
          </div>
        )}

        {/* Accept invitation button */}
        <div
          className={`w-full flex flex-col gap-4 transition-opacity duration-300 ${fade ? "opacity-100" : "opacity-0"
            }`}
        >

          <button onClick={handleAcceptInvitation} className={`w-full py-3 mt-1 rounded-lg shadow-sm transition-colors flex flex-col justify-center items-center gap-0.5 ${currentUser?.email !== invitationDetails.invitedEmail
            ? "bg-gray-900 hover:bg-black"
            : "bg-emerald-600 hover:bg-emerald-700"
            }`}>

            <span className="text-white font-bold text-[15px] leading-5">
              {getButtonLabel()}
            </span>

            <span
              className={`text-xs mt-1 ${currentUser?.email !== invitationDetails.invitedEmail
                ? "text-gray-300"
                : "text-emerald-100"
                }`}
            >
              {invitationDetails.invitedEmail}
            </span>

          </button>

        </div>


      </div >

    </>
  );
};

export default AcceptInvitationPage;