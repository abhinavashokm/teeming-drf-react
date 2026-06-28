import clsx from "clsx";

function WorkspaceAvatar({
    workspace,
    size = "md",
    className = "",
}) {

    const sizeClasses = {
        sm: "w-8 h-8 rounded-[8px] text-[12px]",
        md: "w-12 h-12 rounded-xl text-[16px]",
        lg: "w-16 h-16 rounded-xl text-xl",
        xl: "w-20 h-20 rounded-xl text-3xl",
    };

    const imageSrc =
        workspace?.logoUrl?.startsWith("http")
            ? `${workspace.logoUrl}?v=${Date.now()}`
            : workspace?.logoUrl;

    return (
        <div
            className={clsx(
                "bg-gray-900 flex items-center justify-center text-white font-medium shadow-sm shrink-0 overflow-hidden",
                sizeClasses[size],
                className
            )}
        >
            {workspace?.logoUrl ? (
                <img
                    src={imageSrc}
                    alt={workspace.name}
                    className="w-full h-full object-cover"
                />
            ) : (
                workspace?.name?.[0]?.toUpperCase()
            )}
        </div>
    );
}

export default WorkspaceAvatar;