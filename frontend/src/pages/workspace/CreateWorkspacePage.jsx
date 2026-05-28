import { LayoutGrid } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "../../constants/routePaths";
import useAuth from "../../hooks/auth/useAuth";
import useLogout from "../../hooks/auth/useLogout";
import useCreateWorkspace from "../../hooks/workspace/useCreateWorkspace";
import useMyWorkspaces from "../../hooks/workspace/useMyWorkspaces";
import { toSlug } from "../../utils/slugUtils";
import FormField from "../../components/ui/form/FormField";
import InputField from "../../components/ui/form/InputField";
import PrefixInput from "../../components/ui/form/PrefixInput";


function CreateWorkspacePage() {
    const { data: user } = useAuth()

    const navigate = useNavigate();

    const { register, handleSubmit, setValue } = useForm()
    const [slugEdited, setSlugEdited] = useState(false);


    const handleNameChange = (e) => {
        const val = e.target.value;
        setValue("name", val);
        if (!slugEdited) setValue('slug', toSlug(val));
    };

    const handleSlugChange = (e) => {
        setSlugEdited(true);
        setValue('slug', toSlug(e.target.value));
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
        createWorkspace({ name, slug })

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
                    {/* <div className="flex flex-col gap-1.5">

                        <label className="text-teeming-text-dark font-semibold text-[14px]">
                            Workspace Name
                        </label>

                        <input
                            type="text"
                            placeholder="e.g. Acme Corp"
                            {...register("name")}
                            onChange={handleNameChange}
                            className="
                    w-full
                    py-[11px] px-4
                    bg-white
                    border border-teeming-border
                    rounded-xl

                    text-[15px]
                    text-teeming-text-dark
                    placeholder-teeming-light-gray

                    hover:border-gray-300

                    focus:outline-none
                    focus:ring-2
                    focus:ring-emerald-500/10
                    focus:border-teeming-green

                    transition-all
                "
                        />

                    </div> */}

                    <FormField label="Workspace URL" >
                        <PrefixInput prefix="app.com/">
                            <InputField size="lg" {...register('slug')} className="border-0" focusRing={false}/>
                        </PrefixInput>
                    </FormField>

                    {/* Workspace URL */}
                    {/* <div className="flex flex-col gap-1.5">

                        <label className="text-teeming-text-dark font-semibold text-[14px]">
                            Workspace URL
                        </label>

                        <div
                            className="
                    flex items-center
                    w-full
                    bg-white

                    border border-teeming-border
                    rounded-xl
                    overflow-hidden

                    hover:border-gray-300

                    focus-within:ring-2
                    focus-within:ring-emerald-500/10
                    focus-within:border-teeming-green

                    transition-all
                "
                        >

                            <span
                                className="
                        py-[11px]
                        pl-4 pr-1

                        text-[14px]
                        font-medium
                        text-gray-500

                        select-none
                    "
                            >
                                app.com/
                            </span>

                            <input
                                type="text"
                                placeholder="acme-corp"
                                {...register("slug")}
                                onChange={handleSlugChange}
                                className="
                        flex-1
                        py-[11px]
                        pr-4 pl-0.5

                        bg-transparent

                        text-[14px]
                        text-teeming-text-dark
                        placeholder-teeming-light-gray

                        focus:outline-none
                    "
                            />

                        </div>

                    </div> */}

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