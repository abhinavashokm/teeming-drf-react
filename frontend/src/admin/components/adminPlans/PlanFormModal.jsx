import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Lock } from 'lucide-react';
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

const MODE_CONFIG = {
  create: {
    title: 'Create New Plan',
    subtitle: 'Configure pricing, limits, and features for a new subscription tier.',
    submitLabel: 'Create Plan',
  },
  edit: {
    title: 'Edit Plan',
    subtitle: null, // we'll render a custom banner instead
    submitLabel: 'Save Changes',
  },
  new_version: {
    title: 'Create New Version',
    subtitle: null, // custom banner
    submitLabel: 'Create New Version',
  },
};

// Locked field wrapper — visually distinct from editable fields
function LockedField({ label, value }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <span className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
        <Lock className="w-[10px] h-[10px] text-slate-300" />
      </div>
      <div className="px-3 py-2.5 bg-slate-50 border border-slate-200 border-dashed rounded-lg text-[13px] text-slate-400 font-medium select-none">
        {value || '—'}
      </div>
    </div>
  );
}

function PlanFormModal({ isOpen, onClose, mode = 'create', plan = null }) {
  const { mutate: createPlan, isPending: isCreating } = useCreatePlan();
  // const { mutate: editPlan, isPending: isEditing } = useEditPlan();
  const isPending = isCreating;

  const config = MODE_CONFIG[mode];
  const isEditMode = mode === 'edit';
  const isNewVersion = mode === 'new_version';

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  useEffect(() => {
    if (plan && (isEditMode || isNewVersion)) {
      reset({
        code: plan.code,
        name: plan.name,
        description: plan.description ?? '',
        monthlyPrice: plan.monthlyPrice ?? '',
        maxMembers: plan.maxMembers ?? '',
        maxGoals: plan.maxGoals ?? '',
        canUseAiIdeaSuggestions: plan.canUseAiIdeaSuggestions,
        canUseAiAssistant: plan.canUseAiAssistant,
        canExportWorkspaceData: plan.canExportWorkspaceData,
        tier: plan.tier ?? '',
      });
    } else {
      reset(defaultValues);
    }
  }, [plan, mode, isOpen]);

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  const onSubmit = (data) => {
    const payload = {
      ...data,
      monthlyPrice: data.monthlyPrice || '0.00',
      maxMembers: data.maxMembers ? Number(data.maxMembers) : null,
      maxGoals: data.maxGoals ? Number(data.maxGoals) : null,
    };
    if (isEditMode) {
      // editPlan({ id: plan.id, data: { name: payload.name, description: payload.description } }, { onSuccess: handleClose });
    } else {
      createPlan(payload, { onSuccess: handleClose });
    }
  };

  const isLocked = (field) => {
    if (isEditMode) return !['name', 'description'].includes(field);
    if (isNewVersion) return ['code', 'tier'].includes(field);
    return false;
  };

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} size="lg">
      <BaseModal.Header onClose={handleClose}>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-slate-900">{config.title}</h3>
            {isNewVersion && plan && (
              <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-violet-100 text-violet-600">
                v{plan.version} → v{plan.version + 1}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {config.subtitle}
          </p>
        </div>
      </BaseModal.Header>

      <BaseModal.Body className="space-y-6">

        {/* Mode-specific info banner */}
        {isEditMode && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <Lock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] font-semibold text-amber-800">Limited editing mode</p>
              <p className="text-[12px] text-amber-600 mt-0.5">
                Only <strong>name</strong> and <strong>description</strong> can be changed.
                To update pricing or features, use <strong>Create New Version</strong> instead.
              </p>
            </div>
          </div>
        )}

        {isNewVersion && (
          <div className="flex items-start gap-3 bg-violet-50 border border-violet-200 rounded-xl px-4 py-3">
            <Lock className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] font-semibold text-violet-800">Code and tier are locked</p>
              <p className="text-[12px] text-violet-600 mt-0.5">
                These fields must stay the same to link this version to the existing plan family.
                Everything else can be updated freely.
              </p>
            </div>
          </div>
        )}

        {/* Basic Details */}
        <div className="space-y-4">
          <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Basic Details</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Name — always shown as input (editable in all modes) */}
            <AdminFormField label="Plan Name" error={errors.name?.message}>
              <AdminInputField
                placeholder="e.g. Enterprise"
                {...register('name', { required: 'Plan name is required' })}
              />
            </AdminFormField>

            {/* Code — locked in edit + new_version */}
            {isLocked('code') ? (
              <LockedField label="Plan Code" value={plan?.code} />
            ) : (
              <AdminFormField label="Plan Code" error={errors.code?.message}>
                <AdminInputField
                  placeholder="e.g. ENTERPRISE"
                  {...register('code', { required: 'Plan code is required' })}
                />
              </AdminFormField>
            )}

            {/* Monthly Price — locked in edit mode */}
            {isLocked('monthlyPrice') ? (
              <LockedField label="Monthly Price" value={plan?.monthlyPrice ? `${plan.monthlyPrice}` : '0.00'} />
            ) : (
              <AdminFormField label="Monthly Price ($)" error={errors.monthlyPrice?.message}>
                <AdminInputField
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  {...register('monthlyPrice')}
                />
              </AdminFormField>
            )}

            {/* Tier — locked in edit + new_version */}
            {isLocked('tier') ? (
              <LockedField label="Tier" value={plan?.tier} />
            ) : (
              <AdminFormField label="Tier" error={errors.tier?.message}>
                <AdminInputField
                  type="number"
                  placeholder="e.g. 1"
                  min="1"
                  {...register('tier', { required: 'Tier is required', valueAsNumber: true })}
                />
              </AdminFormField>
            )}

            {/* Description — full width, locked only in new_version? No, it's editable everywhere */}
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
          <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Usage Limits</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {isLocked('maxMembers') ? (
              <LockedField label="Max Members" value={plan?.maxMembers ?? 'Unlimited'} />
            ) : (
              <AdminFormField label="Max Members" error={errors.maxMembers?.message} optional>
                <AdminInputField
                  type="number"
                  placeholder="Leave blank for unlimited"
                  min="1"
                  {...register('maxMembers')}
                />
              </AdminFormField>
            )}

            {isLocked('maxGoals') ? (
              <LockedField label="Max Goals" value={plan?.maxGoals ?? 'Unlimited'} />
            ) : (
              <AdminFormField label="Max Goals" error={errors.maxGoals?.message} optional>
                <AdminInputField
                  type="number"
                  placeholder="Leave blank for unlimited"
                  min="1"
                  {...register('maxGoals')}
                />
              </AdminFormField>
            )}

          </div>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Included Features</h4>
          <div className={`space-y-3 border rounded-xl p-4 ${isEditMode ? 'bg-slate-50/60 border-slate-200 border-dashed' : 'bg-slate-50 border-slate-200'}`}>
            {isEditMode && (
              <p className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
                <Lock className="w-[10px] h-[10px]" />
                Feature toggles are locked in edit mode
              </p>
            )}
            {FEATURES.map(({ key, name }, index) => {
              const locked = isLocked(key);
              return (
                <Controller
                  key={key}
                  name={key}
                  control={control}
                  render={({ field }) => (
                    <div className={`flex items-center justify-between py-2 ${index < FEATURES.length - 1 ? 'border-b border-slate-200' : ''}`}>
                      <span className={`text-[13px] font-medium ${locked ? 'text-slate-400' : 'text-slate-700'}`}>
                        {name}
                      </span>
                      <label className={`relative inline-flex items-center ${locked ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={field.value}
                          onChange={field.onChange}
                          disabled={locked}
                        />
                        <div className={`w-9 h-5 rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all
                          ${locked
                            ? 'bg-slate-100 after:border-slate-200 peer-checked:bg-slate-300'
                            : 'bg-slate-200 after:border-slate-300 peer-checked:after:translate-x-full peer-checked:bg-blue-600'
                          }`}
                        />
                      </label>
                    </div>
                  )}
                />
              );
            })}
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
          {config.submitLabel}
        </AdminButton>
      </BaseModal.Footer>
    </BaseModal>
  );
}

export default PlanFormModal;