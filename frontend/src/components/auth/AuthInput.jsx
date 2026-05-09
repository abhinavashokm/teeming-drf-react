import InputField from "../ui/InputField";

function AuthInput(props) {
    return (
        <div className="w-full relative">
            <InputField {...props} />
        </div>
    )
}

export default AuthInput