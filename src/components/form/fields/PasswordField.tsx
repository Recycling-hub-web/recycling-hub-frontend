import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

import { getNestedValue } from '../utils';

type PasswordFieldProps = {
  label: string;
  field: string;
  required?: boolean;
  placeholder?: string;
  formData: Record<string, unknown>;
  errors?: Record<string, string>;
  updateFormData: (field: string, value: string) => void;
  onBlur?: () => void;
};

const PasswordField = ({
  label,
  field,
  required = true,
  placeholder = '',
  formData,
  errors,
  updateFormData,
  onBlur,
}: PasswordFieldProps) => {
  const [show, setShow] = useState(false);
  const value = (getNestedValue(formData, field) as string | undefined) ?? '';
  const error = errors?.[field];

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-900">
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      <div className="relative mt-2">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => updateFormData(field, e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`flex h-12 w-full items-center justify-start rounded-xl border p-3 py-2 text-sm outline-none transition-colors focus:outline-none focus:ring-1 focus:ring-brand-500 ${
            error
              ? 'border-red-500 bg-red-50'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        />
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export { PasswordField };
