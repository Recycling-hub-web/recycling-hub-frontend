type SettingToggleInputProps = {
  label: string;
  field: string;
  formData: Record<string, unknown>;
  updateFormData: (field: string, value: boolean) => void;
  errors?: Record<string, string>;
  required?: boolean;
  enabledText?: string;
  disabledText?: string;
  enabledDescription?: string;
  disabledDescription?: string;
};

/**
 * Checkbox-driven switch with separate enabled/disabled captions (e.g.
 * "Active" / "Inactive"). Distinct from ToggleInput — that one has a single
 * fixed caption and toggles from clicking the whole row; this one changes
 * its caption to reflect current state and toggles via the switch itself.
 */
const SettingToggleInput = ({
  label,
  field,
  formData,
  updateFormData,
  errors,
  required = false,
  enabledText = 'Enabled',
  disabledText = 'Disabled',
  enabledDescription = 'Click to toggle',
  disabledDescription = 'Click to toggle',
}: SettingToggleInputProps) => {
  const selected = Boolean(formData[field]);

  const toggle = () => updateFormData(field, !selected);

  return (
    <div className="mb-5" data-field={field}>
      <label className="mb-2 block text-sm font-semibold text-slate-900">
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      <label
        className={`group relative flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${
          selected
            ? 'border-brand-600 bg-brand-100 shadow-sm'
            : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
        }`}
      >
        <div className="flex min-w-0 flex-col pr-3">
          <span className="truncate text-sm font-medium text-slate-800">
            {selected ? enabledText : disabledText}
          </span>
          <span className="truncate text-xs text-slate-400">
            {selected ? enabledDescription : disabledDescription}
          </span>
        </div>

        <div className="relative shrink-0">
          <input
            type="checkbox"
            checked={selected}
            onChange={toggle}
            className="peer sr-only"
          />
          <div className="h-6 w-11 rounded-full bg-slate-300 transition-colors peer-checked:bg-brand-600" />
          <div className="absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
        </div>
      </label>

      {errors?.[field] && (
        <p className="mt-1 text-xs text-red-600">{errors[field]}</p>
      )}
    </div>
  );
};

export { SettingToggleInput };
