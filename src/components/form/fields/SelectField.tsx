import { getNestedValue } from '../utils';

type SelectOption = string | { value: string | number; label: string };

type SelectFieldProps = {
  label: string;
  field: string;
  options: SelectOption[];
  required?: boolean;
  formData: Record<string, unknown>;
  errors?: Record<string, string>;
  updateFormData: (field: string, value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
};

const SelectField = ({
  label,
  field,
  options,
  required = true,
  formData,
  errors,
  updateFormData,
  onBlur,
  disabled = false,
}: SelectFieldProps) => {
  const value = (getNestedValue(formData, field) as string | undefined) ?? '';

  return (
    <div className="mb-4" data-field={field}>
      <label className="block text-sm font-medium text-slate-900">
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      <select
        value={value}
        onChange={(e) => updateFormData(field, e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        className={`mt-2 flex h-12 w-full items-center justify-start rounded-xl border p-3 py-2 text-sm outline-none transition-colors focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-60 ${
          errors?.[field]
            ? 'border-red-500 bg-red-50'
            : 'border-slate-200 bg-white hover:bg-slate-50'
        }`}
      >
        <option value="" disabled>
          Select ...
        </option>
        {options.map((opt, index) =>
          typeof opt === 'object' && opt !== null ? (
            <option key={opt.value ?? index} value={opt.value ?? ''}>
              {opt.label ?? opt.value ?? ''}
            </option>
          ) : (
            <option key={`${opt}${index}`} value={opt}>
              {opt}
            </option>
          ),
        )}
      </select>

      {errors?.[field] && (
        <p className="mt-1 text-xs text-red-600">{errors[field]}</p>
      )}
    </div>
  );
};

export { SelectField };
export type { SelectOption };
