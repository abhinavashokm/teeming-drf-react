import { CircleAlert } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatusCard from "../../components/error/StatusCard";
import AppButton from "../../components/ui/buttons/AppButton";
import FullPageLoader from "../../components/ui/FullPageLoader";
import { ROUTE_PATHS } from "../../constants/routePaths";
import useAuth from "../../hooks/auth/useAuth";
import useLogout from "../../hooks/auth/useLogout";
import useAcceptInvitation from "../../hooks/invite/useAcceptInvitation";
import useInvitationToken from "../../hooks/invite/useInvitationToken";
import useResolveInvitation from "../../hooks/invite/useResolveInvitation";
import { getInvitationActionState } from "../../utils/invitationUtils";


const AcceptInvitationPage = () => {

  const { data: invitationDetails, isPending, isError, error } = useResolveInvitation()
  const { data: currentUser } = useAuth()
  const { mutate: logout } = useLogout()
  const { mutate: acceptInvitation } = useAcceptInvitation()

  const navigate = useNavigate()
  const token = useInvitationToken()


  const {
    handleAcceptInvitation, buttonLabel, buttonVariant, isInvitationAccepted,
    isInvitedUser, showWrongUserBanner, showAlreadyUsedBanner, emailColor
  } = getInvitationActionState({
    invitationDetails,
    currentUser,
    token,
    navigate,
    logout,
    acceptInvitation,
  });

  //invitation already accepted and same user session, then redirect to workspace
  useEffect(() => {
    if (
      isInvitationAccepted && isInvitedUser
    ) {
      navigate(
        ROUTE_PATHS.WORKSPACE(invitationDetails.workspace.slug),
        { replace: true }
      )
    }
  }, [isInvitationAccepted, isInvitedUser, invitationDetails, navigate])


  if (isPending) return <FullPageLoader />

  if (isError) {
    if (error?.response?.data?.error?.code === 'INVALID_INVITATION') {
      return (<StatusCard
        icon={CircleAlert}
        title="Invitation Unavailable"
        description="This invitation is invalid, expired, or no longer available."
        helperText="Ask the workspace owner to send you a new invitation."
        badge="Invitation unavailable"
        action={
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 rounded-lg bg-gray-900 hover:bg-black text-white font-semibold transition-colors"
          >
            Return Home
          </button>
        }
      />)
    }

    return (
      <StatusCard
        icon={CircleAlert}
        title="Something went wrong"
        description="We couldn't process this invitation."
        badge="Error"
      />
    )
  }



  return (
    <>

      {/* Card */}
      <div className="w-full max-w-[440px] bg-white border border-gray-200 rounded-xl shadow-sm p-8 transition-all duration-300">
        {/* Avatar */}
        <div className="mb-5 flex justify-center items-center">
          <div className="w-[60px] h-[60px] bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 shadow-sm flex items-center justify-center text-2xl font-bold">
            {invitationDetails.workspace.name[0].toUpperCase()}
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

            {isInvitationAccepted
              ?
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-3 py-1.5">
                <div className="w-2 h-2 rounded-full bg-amber-500" />

                <span className="text-[12px] font-medium text-amber-700">
                  Joined as
                </span>

                <span className="text-[12px] font-semibold text-amber-900 capitalize">
                  {invitationDetails.role}
                </span>

              </div>
              :
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[12px] font-medium text-emerald-700">
                  Joining as
                </span>

                <span className="text-[12px] font-semibold text-emerald-900 capitalize">
                  {invitationDetails.role}
                </span>
              </div>
            }

          </div>

        </div>

        {/* wrong user, warning bannner */}
        {
          currentUser && showWrongUserBanner &&
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
        }

        {/* invitation already used, warning bannner */}
        {
          showAlreadyUsedBanner &&
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-900">
              This invitation has already been used
            </p>

            <p className="mt-1 text-sm text-amber-700">
              The invited user has already joined this workspace.
            </p>
          </div>

        }


        {/* Accept invitation button */}
        <div
          className={`w-full flex flex-col gap-4 transition-opacity duration-300`}
        >
          <AppButton
            variant={buttonVariant}
            size="lg"
            onClick={handleAcceptInvitation}
            className="flex-col"
          >

            <span className="text-white font-bold text-[15px] leading-5">
              {buttonLabel}
            </span>

            <span
              className={`text-xs mt-1 ${emailColor}`}
            >
              {invitationDetails.invitedEmail}
            </span>

          </AppButton>

        </div>
      </div >

    </>
  );
};

export default AcceptInvitationPage;