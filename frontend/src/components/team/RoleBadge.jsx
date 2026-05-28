import { Shield } from "lucide-react"

function RoleBadge({ role }) {

    const roleStyles = {
        owner: {
            label: "Owner",
            className: `
                bg-amber-50
                text-amber-700
                border border-amber-100
            `,
            iconClassName: "text-amber-500",
        },

        admin: {
            label: "Admin",
            className: `
                bg-blue-50
                text-blue-700
                border border-blue-100
            `,
            iconClassName: "text-blue-500",
        },

        member: {
            label: "Member",
            className: `
                text-gray-500
            `,
            iconClassName: "",
        },
    }

    const currentRole = roleStyles[role]

    if (!currentRole) return null

    if (role === "member") {
        return (
            <span className="inline-flex items-center px-2 py-0.5 text-[12px] font-medium text-gray-500">
                {currentRole.label}
            </span>
        )
    }

    return (
        <span
            className={`
                inline-flex items-center gap-1.5
                px-2 py-0.5
                rounded-md

                text-[12px] font-medium

                ${currentRole.className}
            `}
        >
            <Shield
                className={`h-3 w-3 ${currentRole.iconClassName}`}
            />

            {currentRole.label}
        </span>
    )
}

export default RoleBadge

