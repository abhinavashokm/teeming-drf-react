import { useEffect, useMemo, useRef } from "react";
import useTeamMembers from "./useTeamMembers";
import useOnlineMemberIds from "./useOnlineMemberIds";


function useTeamMembersWithPresence() {
    const { data: teamMembers = [], refetch: refetchTeamMembers, ...teamMembersQuery } = useTeamMembers();
    const { data: onlineMemberIds = [], ...onlineMembersQuery } = useOnlineMemberIds();

    const isRefetchingForNewMember = useRef(false);

    useEffect(() => {
        if (!teamMembers.length && teamMembersQuery.isPending) return;

        const knownIds = new Set(teamMembers.map((m) => String(m.userId)));
        const hasUnknownMember = onlineMemberIds.some((id) => !knownIds.has(String(id)));

        if (hasUnknownMember && !isRefetchingForNewMember.current) {
            isRefetchingForNewMember.current = true;
            refetchTeamMembers().finally(() => {
                isRefetchingForNewMember.current = false;
            });
        }
    }, [onlineMemberIds, teamMembers, teamMembersQuery.isPending, refetchTeamMembers]);

    const membersWithPresence = useMemo(() => {
        const onlineSet = new Set(onlineMemberIds);
        return teamMembers.map((member) => ({
            ...member,
            isOnline: onlineSet.has(String(member.userId)),
        }));
    }, [teamMembers, onlineMemberIds]);

    return {
        data: membersWithPresence,
        isLoading: teamMembersQuery.isPending || onlineMembersQuery.isPending,
        isError: teamMembersQuery.isError || onlineMembersQuery.isError,
    };
}

export default useTeamMembersWithPresence;