import { LayoutGrid } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import FormField from "../../components/ui/form/FormField";
import InputField from "../../components/ui/form/InputField";
import PrefixInput from "../../components/ui/form/PrefixInput";
import { ROUTE_PATHS } from "../../constants/routePaths";
import useAuth from "../../hooks/auth/useAuth";
import useLogout from "../../hooks/auth/useLogout";
import useCreateWorkspace from "../../hooks/workspace/useCreateWorkspace";
import useMyWorkspaces from "../../hooks/workspace/useMyWorkspaces";
import { toSlug } from "../../utils/slugUtils";
import { validations } from "../../utils/validations";
import { slugify } from "../../utils/slugUtils";
import { handleFormError } from "../../utils/errorUtils";
import { showApiError } from "../../utils/toast";


function CreateWorkspacePage() {
    const { data: user } = useAuth()

    const navigate = useNavigate();

    const { register, handleSubmit, setValue, setError, formState: { errors } } = useForm()
    const [slugEdited, setSlugEdited] = useState(false);


    const handleNameChange = (e) => {
        const val = e.target.value;
        setValue("name", val);
        if (!slugEdited) setValue('slug', toSlug(val));
    };

    const handleSlugChange = (e) => {
        setSlugEdited(true);
        setValue(
            "slug",
            slugify(e.target.value),
            { shouldValidate: true }
        )
    };


    const { mutate: logout } = useLogout()

    const logoutHandle = () => {
        logout()
        navigate(ROUTE_PATHS.LOGIN)
    }

    const { mutate: createWorkspace, isPending } = useCreateWorkspace()
    const { data: workspaceData } = useMyWorkspaces()

    const haveWorkspaces = workspaceData?.workspaces.length > 0

    const handleCreateWorkspace = ({ name, slug }) => {
        createWorkspace({ name, slug }, {
            onError: (error) => {
                if (handleFormError(error, setError)) {
                    return;
                }

                showApiError(error)
            }
        })

    }

    return (
        <>

            {/* Title */}
            <h1 className="text-teeming-text-dark font-bold text-[28px] leading-[42px] -tracking-[0.025em] text-center mb-1">
                Create your workspace
            </h1>

            {/* Subtitle */}
            <p className="text-[15px] leading-[24px] text-teeming-gray text-center mb-6">
                Your workspace is where your team{" "}
                <br className="hidden sm:block" />
                collaborates, plans, and ships.
            </p>

            {/* Card */}
            {/* Card */}
            <div
                className="
        w-full max-w-[440px]
        bg-white
        border border-teeming-border
        rounded-2xl
        p-8
        shadow-[0_8px_30px_rgba(0,0,0,0.04)]
    "
            >

                <div className="flex flex-col gap-5">

                    {/* Workspace Name */}
                    <FormField label="Workspace Name" >
                        <InputField size="lg" {...register('name')} onChange={handleNameChange} placeholder="e.g. Acme Corp" />
                    </FormField>

                    <FormField label="Workspace URL" error={errors.slug} >
                        <PrefixInput prefix="app.com/">
                            <InputField size="lg" className="border-0" focusRing={false}
                                {...register('slug', validations.slug)} error={errors.slug}
                                onChange={(e) => handleSlugChange(e)}
                            />
                        </PrefixInput>
                    </FormField>

                    {/* Submit */}
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={handleSubmit(handleCreateWorkspace)}
                        className="
                w-full
                mt-1

                py-[11px]
                rounded-xl

                bg-teeming-green
                hover:bg-emerald-600

                disabled:opacity-60
                disabled:cursor-not-allowed

                shadow-sm
                hover:shadow-md

                transition-all duration-200

                flex justify-center items-center
            "
                    >

                        <span className="text-white font-semibold text-[15px] tracking-[-0.01em]">

                            {isPending
                                ? "Creating workspace..."
                                : "Create workspace"
                            }

                        </span>

                    </button>

                </div>

            </div>



            {/* footer section */}
            {
                !haveWorkspaces
                    ?
                    <p className="mt-4 text-[13px] text-teeming-gray text-center">
                        Joining an existing workspace? You’ll need an invite link to continue.
                    </p>


                    :
                    <div className="mt-6 flex flex-col items-center gap-3">

                        <p className="text-[13px] text-gray-500 text-center">
                            Switch to an existing workspace?
                        </p>

                        <button
                            onClick={() => navigate("/workspaces")}
                            className="
                            flex items-center gap-2
                            text-[14px] font-medium
                            text-gray-700 hover:text-gray-900
                            transition-colors
                            group
                        "
                        >
                            <LayoutGrid className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />

                            Browse your workspaces
                        </button>

                    </div>
            }


        </>
    );
}

export default CreateWorkspacePage;