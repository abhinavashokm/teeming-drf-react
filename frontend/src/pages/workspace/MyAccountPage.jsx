import { Camera, Lock, Mail, UserMinus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import useAuth from "../../hooks/auth/useAuth";
import useUpdateProfile from '../../hooks/profile/useUpdateProfile';
import { useEffect } from 'react';
import FormField from '../../components/ui/form/FormField';
import InputField from '../../components/ui/form/InputField';
import AppButton from '../../components/ui/buttons/AppButton';

function MyAccountPage() {

    const { data: currentUser } = useAuth()
    const { mutate: updateProfile, isPending } = useUpdateProfile()

    const { register, handleSubmit, reset, formState: { isDirty } } = useForm({
        defaultValues: {
            fullName: currentUser?.fullName || "",
        }
    })

    useEffect(() => {

        if (currentUser) {
            reset({
                'fullName': currentUser?.fullName
            })
        }

    }, [currentUser, reset])

    const handleUpdateProfile = (data) => {
        updateProfile(data, {
            onSuccess: (res) => {
                reset()
            }
        })
    }

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20">

            {/* Page Header */}
            <div className="flex items-end justify-between border-b border-gray-200 pb-6">
                <div>
                    <h1 className="text-[22px] font-semibold text-gray-900 tracking-tight leading-none mb-1.5">My Account</h1>
                    <p className="text-[13px] text-gray-500">Manage your personal profile, security preferences, and notifications.</p>
                </div>
            </div>

            <div className="space-y-8">

                {/* Profile Section */}
                <section className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200">
                        <h2 className="text-[15px] font-semibold text-gray-900 tracking-tight">Profile Information</h2>
                        <p className="text-[13px] text-gray-500 mt-1">Update your photo and personal details here.</p>
                    </div>

                    <div className="p-6 space-y-6">

                        {/* Avatar Upload */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white text-xl font-medium shrink-0 relative group cursor-pointer overflow-hidden">
                                A
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="h-5 w-5 text-white" />
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="px-3.5 py-1.5 bg-white border border-gray-200 rounded-lg text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                                    Upload new photo
                                </button>
                                <button className="px-3.5 py-1.5 text-[13px] font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                    Remove
                                </button>
                            </div>
                        </div>

                        <div className="space-y-5">

                            <FormField label="Full Name" >
                                <InputField size="md" {...register('fullName')} />
                            </FormField>

                            <div className="space-y-1.5">
                                <label className="text-[13px] font-medium text-gray-700">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input type="email" defaultValue={currentUser.email} disabled className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[13px] text-gray-500 cursor-not-allowed" />
                                </div>
                                <p className="text-[12px] text-gray-500 mt-1.5">To change your email address, please contact support.</p>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end">

                        <AppButton
                            variant="dark"
                            disabled={!isDirty}
                            loading={isPending}
                            onClick={handleSubmit(handleUpdateProfile)}
                        >
                            {isPending ? "Saving..." : "Save Changes"}
                        </AppButton>

                    </div>
                </section>

                {/* Security Section */}
                <section className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                        <div>
                            <h2 className="text-[15px] font-semibold text-gray-900 tracking-tight">Password & Security</h2>
                            <p className="text-[13px] text-gray-500 mt-1">Manage your password and secure your account.</p>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center">
                            <Lock className="h-4 w-4 text-gray-400" />
                        </div>
                    </div>

                    <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <p className="text-[13px] font-medium text-gray-900">Change Password</p>
                            <p className="text-[12px] text-gray-500 mt-0.5">You'll be asked to log in again after changing your password.</p>
                        </div>
                        <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm whitespace-nowrap">
                            Update Password
                        </button>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="bg-red-50/50 border border-red-100 rounded-xl overflow-hidden">
                    <div className="px-6 py-5 border-b border-red-100">
                        <h2 className="text-[15px] font-semibold text-red-900 tracking-tight">Danger Zone</h2>
                        <p className="text-[13px] text-red-700/80 mt-1">Irreversible and destructive actions.</p>
                    </div>

                    <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <p className="text-[13px] font-medium text-red-900">Delete Account</p>
                            <p className="text-[12px] text-red-700/80 mt-0.5">Once you delete your account, there is no going back.</p>
                        </div>
                        <button className="px-4 py-2 bg-white border border-red-200 rounded-lg text-[13px] font-medium text-red-600 hover:bg-red-50 transition-colors shadow-sm whitespace-nowrap flex items-center gap-2">
                            <UserMinus className="h-4 w-4" />
                            Delete Account
                        </button>
                    </div>
                </section>

            </div>
        </div>
    )
}

export default MyAccountPage