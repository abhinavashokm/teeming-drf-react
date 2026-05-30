import { ROUTE_PATHS } from "../constants/routePaths";

export function getInvitationActionState({
    invitationDetails,
    currentUser,
    token,
    navigate,
    logout,
    acceptInvitation,
}) {
    const isInvitationAccepted =
        invitationDetails?.invitationStatus === "accepted";

    const isInvitedUser =
        currentUser?.email === invitationDetails?.invitedEmail;

    const isWrongUser =
        currentUser && !isInvitedUser;

    const buttonLabel = (() => {
        if (isInvitationAccepted) {
            return currentUser
                ? "Log Out & Signin As"
                : "Signin As";
        }

        if (!currentUser) {
            return invitationDetails?.accountExists
                ? "Login As"
                : "Create Account As";
        }

        if (isInvitedUser) {
            return "Accept Invitation";
        }

        return "Log Out & Continue As";
    })();

    const buttonVariant =
        !isInvitationAccepted
            ? "primary"
            : "dark";

    const emailColor = !isInvitationAccepted
        ? "text-gray-300"
        : "text-emerald-100"

    const handleAcceptInvitation = () => {

        // invitation already used
        if (isInvitationAccepted) {

            if (!currentUser) {
                navigate(ROUTE_PATHS.LOGIN);
                return;
            }

            logout(undefined, {
                onSuccess: () => {
                    navigate(ROUTE_PATHS.LOGIN);
                },
            });

            return;
        }

        // correct account
        if (isInvitedUser) {
            acceptInvitation();
            return;
        }

        // not logged in
        if (!currentUser) {
            navigate(
                invitationDetails.accountExists
                    ? ROUTE_PATHS.LOGIN_WITH_INVITE(token)
                    : ROUTE_PATHS.SIGNUP_WITH_INVITE(token)
            );
            return;
        }

        // wrong account
        logout(undefined, {
            onSuccess: () => {
                navigate(
                    invitationDetails.accountExists
                        ? ROUTE_PATHS.LOGIN_WITH_INVITE(token)
                        : ROUTE_PATHS.SIGNUP_WITH_INVITE(token)
                );
            },
        });
    };

    const showWrongUserBanner =
        !isInvitationAccepted && !isInvitedUser;

    const showAlreadyUsedBanner =
        isInvitationAccepted;


    return {
        isInvitationAccepted,
        isInvitedUser,
        isWrongUser,
        buttonLabel,
        buttonVariant,
        showWrongUserBanner,
        showAlreadyUsedBanner,
        handleAcceptInvitation,
    };
}