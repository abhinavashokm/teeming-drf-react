import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthLogo from "../../components/auth/AuthLogo";
import useLogout from "../../hooks/auth/useLogout";


function CreateWorkspacePage() {
    const { user, accessToken } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [slugEdited, setSlugEdited] = useState(false);

    const toSlug = (val) =>
        val.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const handleNameChange = (e) => {
        const val = e.target.value;
        setName(val);
        if (!slugEdited) setSlug(toSlug(val));
    };

    const handleSlugChange = (e) => {
        setSlugEdited(true);
        setSlug(toSlug(e.target.value));
    };

    const handleSubmit = () => {
        if (!name.trim()) return;
        // dispatch create workspace action here
    };

    const { mutate: logout } = useLogout()

    const logoutHandle = () => {
        logout()
        navigate("/auth/login/")
    }

    // console.log(user)
    // console.log(accessToken)
    return (
        <div className="h-screen w-full flex flex-col relative overflow-hidden font-sans auth-body">

            {/* Header */}
            <header className="w-full flex justify-between items-center px-8 md:px-12 py-6 z-10">
                <button
                    onClick={logoutHandle}
                    className="text-teeming-gray hover:text-teeming-text-dark text-[14px] font-medium transition-colors"
                >
                    Log out
                </button>
                <div className="flex items-center gap-1.5 text-[14px]">
                    <span className="text-teeming-gray">Logged in as</span>
                    <span className="text-teeming-text-dark font-semibold">{user?.email}</span>
                </div>
            </header>

            {/* Main */}
            <div className="flex-1 w-full flex flex-col mt-4 items-center px-6 z-10">
                <div className="w-full max-w-[440px] flex flex-col items-center">

                    {/* Logo */}
                    <AuthLogo className="mb-4" />

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
                    <div className="w-full bg-white border border-teeming-border rounded-xl shadow-sm p-8">
                        <div className="flex flex-col gap-4">

                            {/* Workspace Name */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-teeming-text-dark font-semibold text-[14px] leading-5">
                                    Workspace Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={handleNameChange}
                                    placeholder="e.g. Acme Corp"
                                    className="w-full py-[10px] px-4 bg-white border border-teeming-border rounded-lg text-[15px] text-teeming-text-dark placeholder-teeming-light-gray focus:outline-none focus:ring-1 focus:ring-teeming-green focus:border-teeming-green transition-all"
                                />
                            </div>

                            {/* Workspace URL */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-teeming-text-dark font-semibold text-[14px] leading-5">
                                    Workspace URL
                                </label>
                                <div className="flex items-center w-full border border-teeming-border rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-teeming-green focus-within:border-teeming-green transition-all bg-white">
                                    <span className="py-[10px] pl-4 pr-0.5 text-teeming-gray text-[14px] leading-5 select-none">
                                        app.com/
                                    </span>
                                    <input
                                        type="text"
                                        value={slug}
                                        onChange={handleSlugChange}
                                        placeholder="acme-corp"
                                        className="flex-1 py-[10px] pr-4 pl-0.5 bg-transparent text-[14px] text-teeming-text-dark placeholder-teeming-light-gray focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={!name.trim()}
                                className="w-full py-[10px] mt-1 bg-teeming-green hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors flex justify-center items-center"
                            >
                                <span className="text-white font-bold text-[16px] leading-6 -tracking-[0.024em]">
                                    Create workspace
                                </span>
                            </button>

                        </div>
                    </div>

                    {/* Already have an invite? */}
                    <p className="mt-4 text-[13px] text-teeming-gray text-center">
                        Joining a team?{" "}
                        <span className="text-teeming-text-dark font-medium">
                            Ask your admin to send you an invite link.
                        </span>
                    </p>

                </div>
            </div>
        </div>
    );
}

export default CreateWorkspacePage;