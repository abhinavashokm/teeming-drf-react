/**
 * MemberAvatar.jsx — Reusable avatar component
 *
 * Props:
 *   user        {object}  { fullName, email, avatarUrl } — server state
 *   preview     {string}  Local blob URL from a pending file selection — takes priority over user.avatarUrl
 *   initials    {string}  Optional override (e.g. 'AJ'). Defaults to first+last initial
 *   size        {string}  'xs' | 'sm' | 'md' | 'lg' | 'xl' — defaults to 'md'
 *   showYou     {boolean} Show a "You" badge
 *   className   {string}  Extra classes on the wrapper
 */

import clsx from "clsx";
import { getAvatarColor } from "../../utils/styleUtils";

function deriveInitials(name = '', initialsOverride) {
    if (initialsOverride) return initialsOverride
    const parts = name.trim().split(' ')
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    return name[0]?.toUpperCase() ?? '?'
}

const SIZE_CLASSES = {
    xs: "w-5 h-5 text-[8px]",
    sm: "w-7 h-7 text-[10px]",
    md: "w-8 h-8 text-[12px]",
    lg: "w-10 h-10 text-[13px]",
    xl: "w-16 h-16 text-xl",
}

function MemberAvatar({
    user,
    preview = null,
    initials: initialsOverride,
    size = 'md',
    showYou = false,
    className = '',
}) {

    if (!user) {
        return (
            <div className={`rounded-full bg-gray-100 animate-pulse shrink-0 ${SIZE_CLASSES[size] ?? SIZE_CLASSES.md} ${className}`} />
        )
    }

    const name = user?.fullName
    const email = user?.email
    const avatarUrl = user?.avatarUrl

    const color = getAvatarColor(email)
    const initials = deriveInitials(name, initialsOverride)

    // preview (local blob) wins — it's the most current pending state and
    // doesn't need cache-busting since each File produces a unique blob URL
    const imageSrc = preview
        ? preview
        : avatarUrl?.startsWith("http")
            ? `${avatarUrl}?v=${Date.now()}`
            : avatarUrl;

    const hasImage = Boolean(preview || avatarUrl);

    return (
        <div className={`relative inline-flex shrink-0 ${className}`}>
            <div
                className={clsx(
                    "rounded-full flex items-center justify-center font-medium shrink-0 overflow-hidden",
                    SIZE_CLASSES[size] ?? SIZE_CLASSES.md,
                    !hasImage && color
                )}
            >
                {hasImage ? (
                    <img
                        src={imageSrc}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    initials
                )}
            </div>
            {showYou && (
                <span className="absolute -bottom-1 -right-1 text-[8px] font-semibold px-1 py-px rounded bg-gray-100 text-gray-500 uppercase tracking-wide leading-none">
                    you
                </span>
            )}
        </div>
    )
}

export default MemberAvatar