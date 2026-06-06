import { Shield } from "lucide-react"

function RoleBadge({ role, size = 'md' }) {
    const roleStyles = {
        owner: {
            label: "Owner",
            className: "bg-amber-50 text-amber-700 border border-amber-100",
            iconClassName: "text-amber-500",
        },
        admin: {
            label: "Admin",
            className: "bg-blue-50 text-blue-700 border border-blue-100",
            iconClassName: "text-blue-500",
        },
        member: {
            label: "Member",
            className: "text-gray-500",
            iconClassName: "",
        },
    }

    const currentRole = roleStyles[role]
    if (!currentRole) return null

    const isSm = size === 'sm'

    if (role === "member") {
        return (
            <span className={`inline-flex items-center px-2 py-0.5 font-medium text-gray-500 ${isSm ? 'text-[10px]' : 'text-[12px]'}`}>
                {currentRole.label}
            </span>
        )
    }

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-medium ${currentRole.className} ${isSm ? 'text-[10px]' : 'text-[12px]'}`}>
            <Shield className={`${isSm ? 'h-2.5 w-2.5' : 'h-3 w-3'} ${currentRole.iconClassName}`} />
            {currentRole.label}
        </span>
    )
}

export default RoleBadge