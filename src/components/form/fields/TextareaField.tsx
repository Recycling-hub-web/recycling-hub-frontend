import { getNestedValue } from '../utils';

type TextareaFieldProps = {
  label: string;
  field: string;
  required?: boolean;
  placeholder?: string;
  formData: Record<string, unknown>;
  errors?: Record<string, string>;
  updateFormData: (field: string, value: string) => void;
  onBlur?: () => void;
};

const TextareaField = ({
  label,
  field,
  required = true,
  placeholder = '',
  formData,
  errors,
  updateFormData,
  onBlur,
}: TextareaFieldProps) => {
  const value = (getNestedValue(formData, field) as string | undefined) ?? '';

  return (
    <div className="mb-4" data-field={field}>
      <label className="block text-sm font-medium text-slate-900">
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      <textarea
        value={value}
        onChange={(e) => updateFormData(field, e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`mt-2 min-h-[96px] w-full resize-y rounded-xl border p-3 text-sm outline-none transition-colors focus:outline-none focus:ring-1 focus:ring-brand-500 ${
          errors?.[field]
            ? 'border-red-500 bg-red-50'
            : 'border-slate-200 bg-white hover:bg-slate-50'
        }`}
      />

      {errors?.[field] && (
        <p className="mt-1 text-xs text-red-600">{errors[field]}</p>
      )}
    </div>
  );
};

export { TextareaField };
