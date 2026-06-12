import logo from '/src/assets/logo.png'
import teemingFavicon from "/src/assets/teemingFavicon.png"
import teemingLogo from "/src/assets/teeming.png"


const AuthLogo = () => {
    return (
        <div className="mb-4 flex justify-center">
            <img
                src={teemingFavicon}
                alt="Teeming Logo"
                className="w-auto h-14 object-contain"
            />
        </div>
    )
}

export default AuthLogo