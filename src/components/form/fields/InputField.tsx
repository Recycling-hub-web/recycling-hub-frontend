import { fieldStateClasses, getNestedValue } from '../utils';

type InputFieldProps = {
  label: string;
  field: string;
  dataField?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  formData: Record<string, unknown>;
  errors?: Record<string, string>;
  updateFormData: (field: string, value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  helperText?: string;
};

const InputField = ({
  label,
  field,
  dataField,
  type = 'text',
  required = true,
  placeholder = '',
  formData,
  errors,
  updateFormData,
  onBlur,
  disabled = false,
  helperText = '',
}: InputFieldProps) => {
  const value =
    (getNestedValue(formData, field) as string | number | undefined) ?? '';
  const error = errors?.[field];

  const dateProps =
    type === 'date' ? { min: '1900-01-01', max: '2099-12-31' } : {};

  return (
    <div className="mb-4" data-field={dataField ?? field}>
      <label className="block text-sm font-medium text-slate-900">
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          updateFormData(
            field,
            type === 'email' ? e.target.value.toLowerCase() : e.target.value,
          )
        }
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        {...dateProps}
        className={`mt-2 flex h-12 w-full items-center justify-start rounded-xl border p-3 py-2 text-sm outline-none transition-colors focus:outline-none focus:ring-1 focus:ring-brand-500 ${fieldStateClasses(disabled, Boolean(error))}`}
      />

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {!error && disabled && helperText && (
        <p className="mt-1 text-xs text-slate-400">{helperText}</p>
      )}
    </div>
  );
};

export { InputField };
