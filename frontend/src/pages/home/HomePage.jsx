import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"

function HomePage() {

    const dispatch = useDispatch()

    const user = useSelector((state) => state.auth.user)

    const handleLogout = () => {

    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">

            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                <div className="flex flex-col gap-1">

                    <h1 className="text-2xl font-bold text-gray-900">
                        Welcome back
                    </h1>

                    <p className="text-sm text-gray-500">
                        Authentication test dashboard
                    </p>

                </div>

                <div className="mt-6 rounded-xl bg-gray-50 p-4 border border-gray-100">

                    <div className="flex flex-col gap-4">

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                Full Name
                            </p>

                            <p className="mt-1 text-sm font-medium text-gray-900">
                                {user?.full_name || "No name"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                Email
                            </p>

                            <p className="mt-1 text-sm font-medium text-gray-900">
                                {user?.email || "No email"}
                            </p>
                        </div>

                    </div>

                </div>


                <Link to={'/auth/login'} >
                    <button
                        onClick={handleLogout}
                        className="mt-6 w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-black"
                    >
                        Logout
                    </button>
                </Link>

            </div>

        </div>
    )
}

export default HomePage