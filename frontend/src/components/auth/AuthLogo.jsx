import logo from '/src/assets/logo.png'


const AuthLogo = () => {
    return (
        <div className="mb-4 flex justify-center">
            <img
                src={logo}
                alt="Teeming Logo"
                className="w-auto h-18 object-contain"
            />
        </div>
    )
}

export default AuthLogo