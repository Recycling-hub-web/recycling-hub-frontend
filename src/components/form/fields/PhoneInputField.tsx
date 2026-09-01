import { DIAL_CODES } from '../../../constants/dialCodes';

type PhoneInputFieldProps = {
  label?: string;
  dialCodeField: string;
  numberField: string;
  formData: Record<string, unknown>;
  errors?: Record<string, string>;
  updateFormData: (field: string, value: string) => void;
  required?: boolean;
  placeholder?: string;
  onBlur?: () => void;
};

const PhoneInputField = ({
  label = 'Phone Number',
  dialCodeField,
  numberField,
  formData,
  errors,
  updateFormData,
  required = true,
  placeholder = '12-345 6789',
  onBlur,
}: PhoneInputFieldProps) => {
  const dialCode = (formData[dialCodeField] as string | undefined) ?? '+60';
  const number = (formData[numberField] as string | undefined) ?? '';
  const error = errors?.[numberField];

  const handleNumberChange = (value: string) => {
    updateFormData(numberField, value.replace(/[^\d\s()-]/g, ''));
  };

  return (
    <div className="mb-4" data-field={numberField}>
      <label className="block text-sm font-medium text-slate-900">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <div
        className={`mt-2 flex h-12 overflow-hidden rounded-xl border transition ${error ? 'border-red-500' : 'border-slate-200'}`}
      >
        <select
          value={dialCode}
          onChange={(e) => updateFormData(dialCodeField, e.target.value)}
          className="shrink-0 border-r border-slate-200 px-2 text-xs text-slate-700 outline-none hover:bg-slate-50"
        >
          {DIAL_CODES.map((d) => (
            <option key={d.code} value={d.code}>
              {d.label}
            </option>
          ))}
        </select>
        <input
          type="tel"
          value={number}
          onChange={(e) => handleNumberChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className="flex-1 bg-white px-3 text-sm outline-none hover:bg-slate-50"
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export { PhoneInputField };
