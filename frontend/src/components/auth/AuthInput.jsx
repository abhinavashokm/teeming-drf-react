import InputField from "../ui/InputField11";
import InputFieldError from "../ui/form/InputFieldError";

function AuthInput({error, ...props}) {
    return (
        <div className="w-full">
            <InputField {...props} />
            {
                error &&
                <InputFieldError errorMessage={error.message} />
            }
            
        </div>
    )
}

export default AuthInput