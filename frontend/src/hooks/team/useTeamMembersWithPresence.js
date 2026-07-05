import { useMemo } from "react";
import useTeamMembers from "./useTeamMembers";
import useOnlineMemberIds from "./useOnlineMemberIds";

function useTeamMembersWithPresence() {
    const { data: teamMembers = [], ...teamMembersQuery } = useTeamMembers();
    const { data: onlineMemberIds = [], ...onlineMembersQuery } = useOnlineMemberIds();

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