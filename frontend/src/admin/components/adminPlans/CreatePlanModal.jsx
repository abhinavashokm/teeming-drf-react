import { useForm, Controller } from 'react-hook-form';
import BaseModal from '../../../components/ui/modal/BaseModal';
import AdminFormField from '../form/AdminFormField';
import AdminInputField from '../form/AdminInputField';
import useCreatePlan from '../../hooks/adminPlans/useCreatePlan';
import AdminButton from '../form/AdminButton';

const FEATURES = [
  { key: 'canUseAiIdeaSuggestions', name: 'AI Idea Suggestions' },
  { key: 'canUseAiAssistant', name: 'Advanced AI Chat Assistant' },
  { key: 'canExportWorkspaceData', name: 'Export report as CSV' },
];

const defaultValues = {
  code: '',
  name: '',
  description: '',
  monthlyPrice: '',
  maxMembers: '',
  maxGoals: '',
  canUseAiIdeaSuggestions: false,
  canUseAiAssistant: false,
  canExportWorkspaceData: false,
  tier: '',
};

function CreatePlanModal({ isOpen, onClose }) {
  const { mutate: createPlan, isPending } = useCreatePlan();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data) => {
    createPlan(
      {
        ...data,
        monthlyPrice: data.monthlyPrice || '0.00',
        maxMembers: data.maxMembers ? Number(data.maxMembers) : null,
        maxGoals: data.maxGoals ? Number(data.maxGoals) : null,
      },
      { onSuccess: handleClose }
    );
  };

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} size="lg">
      <BaseModal.Header onClose={handleClose}>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Create New Plan</h3>
          <p className="text-sm text-slate-500 mt-1">Configure pricing, limits, and features for a new subscription tier.</p>
        </div>
      </BaseModal.Header>

      <BaseModal.Body className="space-y-6">

        {/* Basic Details */}
        <div className="space-y-4">
          <h4 className="text-[13px] font-bold text-slate-900 uppercase tracking-wider">Basic Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <AdminFormField label="Plan Name" error={errors.name?.message}>
              <AdminInputField
                placeholder="e.g. Enterprise"
                {...register('name', { required: 'Plan name is required' })}
              />
            </AdminFormField>

            <AdminFormField label="Plan Code" error={errors.code?.message}>
              <AdminInputField
                placeholder="e.g. ENTERPRISE"
                {...register('code', { required: 'Plan code is required' })}
              />
            </AdminFormField>

            <AdminFormField label="Monthly Price ($)" error={errors.monthlyPrice?.message} className="md:col-span-2">
              <AdminInputField
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
                {...register('monthlyPrice')}
              />
            </AdminFormField>

            <AdminFormField label="Tier" error={errors.tier?.message} className="md:col-span-2">
              <AdminInputField
                type="number"
                placeholder="e.g. 1 (lower = higher priority)"
                min="1"
                {...register('tier', { required: 'Tier is required', valueAsNumber: true })}
              />
            </AdminFormField>

            <AdminFormField label="Description" error={errors.description?.message} optional className="md:col-span-2">
              <textarea
                placeholder="Brief description of this plan..."
                rows={2}
                className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1A1A2E] focus:ring-2 focus:ring-[#1A1A2E]/20 transition-colors resize-none"
                {...register('description')}
              />
            </AdminFormField>

          </div>
        </div>

        {/* Usage Limits */}
        <div className="space-y-4">
          <h4 className="text-[13px] font-bold text-slate-900 uppercase tracking-wider">Usage Limits</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <AdminFormField label="Max Members" error={errors.maxMembers?.message} optional>
              <AdminInputField
                type="number"
                placeholder="Leave blank for unlimited"
                min="1"
                {...register('maxMembers')}
              />
            </AdminFormField>

            <AdminFormField label="Max Goals" error={errors.maxGoals?.message} optional>
              <AdminInputField
                type="number"
                placeholder="Leave blank for unlimited"
                min="1"
                {...register('maxGoals')}
              />
            </AdminFormField>

          </div>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <h4 className="text-[13px] font-bold text-slate-900 uppercase tracking-wider">Included Features</h4>
          <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
            {FEATURES.map(({ key, name }, index) => (
              <Controller
                key={key}
                name={key}
                control={control}
                render={({ field }) => (
                  <div className={`flex items-center justify-between pb-3 ${index < FEATURES.length - 1 ? 'border-b border-slate-200' : ''}`}>
                    <span className="text-sm text-slate-700 font-medium">{name}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={field.value}
                        onChange={field.onChange}
                      />
                      <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all" />
                    </label>
                  </div>
                )}
              />
            ))}
          </div>
        </div>

      </BaseModal.Body>

      <BaseModal.Footer className="border-slate-200 gap-3">
        <button
          type="button"
          onClick={handleClose}
          className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200/70 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <AdminButton
          onClick={handleSubmit(onSubmit)}
          disabled={isPending}
          isLoading={isPending}
          className="w-auto px-6"
        >
          Create Plan
        </AdminButton>
      </BaseModal.Footer>
    </BaseModal>
  );
}

export default CreatePlanModal;