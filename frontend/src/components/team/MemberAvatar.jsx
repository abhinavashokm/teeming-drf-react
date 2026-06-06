/**
 * Avatar.jsx — Reusable avatar component
 *
 * Props:
 *   name        {string}  Full name — used to derive initials
 *   color       {string}  Tailwind classes from your utility e.g. getAvatarColor(email)
 *   initials    {string}  Optional override (e.g. 'AJ'). Defaults to first+last initial
 *   size        {string}  'xs' | 'sm' | 'md' | 'lg' — defaults to 'md'
 *   showYou     {boolean} Show a "You" badge
 *   className   {string}  Extra classes on the wrapper
 */

import { getAvatarColor } from "../../utils/styleUtils"

function deriveInitials(name = '', email, initialsOverride) {
    if (initialsOverride) return initialsOverride
    const parts = name.trim().split(' ')
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    return name[0]?.toUpperCase() ?? '?'
}

const SIZE_CLASSES = {
    xs: { wrapper: 'w-5 h-5', text: 'text-[8px]' },
    sm: { wrapper: 'w-7 h-7', text: 'text-[10px]' },
    md: { wrapper: 'w-8 h-8', text: 'text-[12px]' },
    lg: { wrapper: 'w-10 h-10', text: 'text-[13px]' },
}

export default function MemberAvatar({
    name = '',
    email='',
    initials: initialsOverride,
    size = 'md',
    showYou = false,
    className = '',
}) {
    const color = getAvatarColor(email)
    const initials = deriveInitials(name, initialsOverride)
    const { wrapper, text } = SIZE_CLASSES[size] ?? SIZE_CLASSES.md

    return (
        <div className={`relative inline-flex shrink-0 ${className}`}>
            <div className={`${wrapper} rounded-full flex items-center justify-center font-medium ${text} ${color}`}>
                {initials}
            </div>
            {showYou && (
                <span className="absolute -bottom-1 -right-1 text-[8px] font-semibold px-1 py-px rounded bg-gray-100 text-gray-500 uppercase tracking-wide leading-none">
                    you
                </span>
            )}
        </div>
    )
}