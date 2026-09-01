import { getNestedValue } from '../utils';

type RadioOption = { label: string; value: string };

type RadioFieldProps = {
  label: string;
  field: string;
  options: RadioOption[];
  formData: Record<string, unknown>;
  errors?: Record<string, string>;
  updateFormData: (field: string, value: string) => void;
  required?: boolean;
};

const RadioField = ({
  label,
  field,
  options,
  formData,
  errors,
  updateFormData,
  required = true,
}: RadioFieldProps) => {
  const value = getNestedValue(formData, field);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-900">
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      <div className="mt-2 flex gap-2">
        {options.map((opt) => (
          <label
            key={opt.label}
            className={`flex h-12 w-full items-center justify-start rounded-xl border p-3 py-2 text-sm outline-none transition-colors focus:outline-none focus:ring-1 focus:ring-brand-500 ${
              errors?.[field] ? 'border-red-500 bg-red-50' : 'border-slate-200'
            } ${value === opt.value ? 'border-brand-500 bg-brand-100' : 'bg-white hover:bg-slate-50'}`}
          >
            <input
              type="radio"
              name={field}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => updateFormData(field, opt.value)}
              className="hidden"
            />
            {opt.label}
          </label>
        ))}
      </div>

      {errors?.[field] && (
        <p className="mt-1 text-xs text-red-600">{errors[field]}</p>
      )}
    </div>
  );
};

export { RadioField };
