import teemingFavicon from "/src/assets/teemingFavicon.png"

const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-14 w-auto",
}

const AuthLogo = ({ size = "md" }) => {
    return (
        <img
            src={teemingFavicon}
            alt="Teeming Logo"
            className={`${sizeClasses[size]} object-contain`}
        />
    )
}

export default AuthLogo