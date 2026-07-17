import { AlertTriangle, Building, Camera, Globe, Lock, Trash2, Unlock } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import AppButton from '../../components/ui/buttons/AppButton';
import FormField from '../../components/ui/form/FormField';
import InputField from '../../components/ui/form/InputField';
import useDeleteWorkspace from '../../hooks/workspace/useDeleteWorkspace';
import useUpdateWorkspace from '../../hooks/workspace/useUpdateWorkspace';
import useUploadWorkspaceLogo from '../../hooks/workspace/useUploadWorkspaceLogo';
import useWorkspace from '../../hooks/workspace/useWorkspace';
import { slugify } from '../../utils/slugUtils';
import WorkspaceAvatar from '../../components/workspace/WorkspaceAvatar';
import useRemoveWorkspaceLogo from '../../hooks/workspace/useRemoveWorkspaceLogo';
import DangerConfirmationModal from '../../components/ui/modal/DangerConfirmationModal';


function WorkspaceSettingsPage() {

    const { data: currentWorkspace } = useWorkspace()
    const { mutate: deleteWorkspace, isPending: isDeleteWorkspacePending } = useDeleteWorkspace()
    const { mutate: uploadLogo } = useUploadWorkspaceLogo()
    const { mutate: removeLogo, isPending: removingLogo } = useRemoveWorkspaceLogo()

    const { register, handleSubmit, reset, resetField, setValue, formState: { isDirty } } = useForm({
        defaultValues: {
            name: currentWorkspace?.name || "",
            slug: currentWorkspace?.slug || "",
        }
    })

    useEffect(() => {
        if (currentWorkspace) {
            reset({
                name: currentWorkspace.name,
                slug: currentWorkspace.slug,
            })
        }
    }, [currentWorkspace, reset])

    const handleSlugChange = (e) => {
        setValue(
            "slug",
            slugify(e.target.value),
            { shouldValidate: true, shouldDirty: true, }
        )
    };

    const [isSlugUnlocked, setIsSlugUnlocked] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleDeleteWorkspace = () => {
        deleteWorkspace()
    }

    /* -------------------------------------------------------------------------- */
    /* LOGO UPLOAD */
    /* -------------------------------------------------------------------------- */
    const fileInputRef = useRef(null);
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
    };

    //clean up preview urls
    useEffect(() => {
        return () => {
            if (logoPreview) {
                URL.revokeObjectURL(logoPreview);
            }
        };
    }, [logoPreview]);

    const handleRemoveLogo = () => {
        removeLogo(null, {
            onSuccess: () => {
                setLogoFile(null)
                setLogoPreview(null)
            }
        })
    }

    const hasLogo = Boolean(logoPreview || currentWorkspace?.logoUrl);

    /* -------------------------------------------------------------------------- */
    /* update workspace details */
    /* -------------------------------------------------------------------------- */
    const { mutateAsync: updateWorkspace, isPending } = useUpdateWorkspace()

    const handleUpdateWorkspace = async (data) => {
        try {

            if (logoFile) {
                await uploadLogo(logoFile);
            }

            updateWorkspace(data, {
                onSuccess: () => {
                    setLogoFile(null);
                    reset();
                    setIsSlugUnlocked(false);
                }
            });

        } catch (error) {
            console.error(error);
        }
    };



    return (
        <div className="max-w-5xl mx-auto space-y-14 pb-20">

            {/* Page Header */}
            <div className="flex items-end justify-between border-b border-gray-200 pb-6">
                <div>
                    <h1 className="text-[22px] font-semibold text-gray-900 tracking-tight leading-none mb-1.5">Workspace Settings</h1>
                    <p className="text-[13px] text-gray-500">Manage your workspace preferences, branding, and permissions.</p>
                </div>
            </div>

            {/* General Settings Section */}
            <section className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    <div>
                        <h2 className="text-[15px] font-semibold text-gray-900 tracking-tight leading-none">General Details</h2>
                    </div>
                </div>

                <div className="p-6 space-y-6">

                    {/* Workspace Logo Upload */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        {/* hidden input for Logo Upload */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />

                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="relative group cursor-pointer"
                        >
                            <WorkspaceAvatar
                                workspace={{
                                    ...currentWorkspace,
                                    logoUrl: logoPreview || currentWorkspace?.logoUrl,
                                }}
                                size="lg"
                            />
                            {
                                !(hasLogo) &&
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                                    <Camera className="h-5 w-5 text-white" />
                                </div>
                            }

                        </div>

                        <div className="flex items-center gap-3">

                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-3.5 py-1.5 bg-white border border-gray-200 rounded-lg text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                Upload new logo
                            </button>

                            <AppButton
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={handleRemoveLogo}
                                loading={removingLogo}
                                disabled={!logoFile && !currentWorkspace?.logoUrl}
                                className="!text-gray-500 hover:!text-red-600 hover:!bg-red-50 !border-transparent hover:!border-red-200"
                            >
                                Remove
                            </AppButton>

                        </div>
                    </div>

                    <div className="space-y-5">

                        <FormField label={"Workspace Name"} >
                            <InputField {...register('name')} />
                        </FormField>
                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <label className="text-[13px] font-medium text-gray-700">Workspace URL</label>
                                <div className={`rounded-lg overflow-hidden border transition-colors ${isSlugUnlocked ? 'border-amber-300 focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-300 bg-white' : 'border-gray-200 bg-gray-50'}`}>
                                    {/* Prefix row */}
                                    <div className={`flex items-center px-3 py-2 border-b text-[13px] gap-1.5 ${isSlugUnlocked ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                                        <Globe className="h-3.5 w-3.5 shrink-0" />
                                        teeming.app/
                                    </div>
                                    {/* Input + lock row */}
                                    <div className="flex items-center">
                                        <input
                                            type="text"
                                            {...register('slug')}
                                            onChange={(e) => handleSlugChange(e)}
                                            disabled={!isSlugUnlocked}
                                            className={`flex-1 w-full px-3 py-2 text-[13px] focus:outline-none ${isSlugUnlocked ? 'bg-white text-gray-900' : 'bg-gray-50 text-gray-500 cursor-not-allowed'}`}
                                        />
                                        <button
                                            onClick={() => { setIsSlugUnlocked(!isSlugUnlocked), resetField('slug'); }}
                                            className={`px-3 py-2 border-l transition-colors ${isSlugUnlocked ? 'text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100' : 'text-gray-400 bg-white border-transparent hover:bg-gray-100 hover:text-gray-600'}`}
                                        >
                                            {isSlugUnlocked ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {isSlugUnlocked && (
                                <div className="bg-amber-50 border border-amber-200/60 rounded-lg p-3">
                                    <div className="flex gap-2.5">
                                        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="text-[12px] font-semibold text-amber-800">Changing your slug will:</h4>
                                            <ul className="text-[12px] text-amber-700/90 mt-1 list-disc pl-4 space-y-0.5">
                                                <li>Break all existing shared links</li>
                                                <li>Break any API integrations using this URL</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end">

                    <AppButton
                        variant="dark"
                        disabled={!isDirty && !logoFile}
                        loading={isPending}
                        onClick={handleSubmit(handleUpdateWorkspace)}
                    >
                        {isPending ? "Saving..." : "Save Changes"}
                    </AppButton>

                </div>
            </section>

            {/* Danger Zone */}
            <section className="bg-red-50/50 border border-red-100 rounded-xl overflow-hidden">
                <div className="px-6 py-5 border-b border-red-100">
                    <h2 className="text-[15px] font-semibold text-red-900 tracking-tight leading-none">Danger Zone</h2>
                    <p className="text-[13px] text-red-700/80 mt-1">Irreversible and destructive actions.</p>
                </div>

                <div className="p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="max-w-md">
                        <p className="text-[13px] font-medium text-red-900">Delete Workspace</p>
                        <p className="text-[12px] text-red-700/80 mt-1">Permanently delete this workspace and all of its data. This action cannot be undone, and all members will lose access.</p>
                    </div>
                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="px-4 py-2 bg-white border border-red-200 rounded-lg text-[13px] font-medium text-red-600 hover:bg-red-50 transition-colors shadow-sm whitespace-nowrap flex items-center gap-2 mt-1 sm:mt-0"
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete Workspace
                    </button>
                </div>
            </section>

            {/* Delete Workspace Modal */}
            <DangerConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteWorkspace}
                title="Delete Workspace"
                description={
                    <>
                        You are about to permanently delete the{' '}
                        <span className="font-semibold text-gray-900">{currentWorkspace.name}</span> workspace.
                        All data, members, and settings will be permanently removed.
                    </>
                }
                confirmationLabel="Type the workspace slug to confirm"
                confirmationValue={currentWorkspace.slug}
                confirmButtonText="Delete Workspace"
                confirmButtonTextOnLoading="Deleting..."
                isLoading={isDeleteWorkspacePending}
            />

        </div>
    )
}

export default WorkspaceSettingsPage