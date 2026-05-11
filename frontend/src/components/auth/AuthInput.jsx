import InputField from "../ui/InputField";
import InputFieldError from "../ui/InputFieldError";

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