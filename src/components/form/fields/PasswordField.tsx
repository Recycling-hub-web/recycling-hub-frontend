import { Eye, EyeOff } from 'lucide-react';
import { useId, useState } from 'react';

import { usePortalLocale } from '../../../contexts/PortalLocaleContext';
import { fieldErrorAttributes, getNestedValue } from '../utils';

type PasswordFieldProps = {
  label: string;
  field: string;
  required?: boolean;
  placeholder?: string;
  formData: Record<string, unknown>;
  errors?: Record<string, string>;
  updateFormData: (field: string, value: string) => void;
  onBlur?: () => void;
  autoComplete?: 'current-password' | 'new-password';
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
  autoComplete = 'current-password',
}: PasswordFieldProps) => {
  const { auth } = usePortalLocale();
  const inputId = useId();
  const [show, setShow] = useState(false);
  const value = (getNestedValue(formData, field) as string | undefined) ?? '';
  const error = errors?.[field];

  return (
    <div className="mb-4" data-field={field}>
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-slate-900"
      >
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      <div className="relative mt-2">
        <input
          id={inputId}
          name={field}
          required={required}
          aria-required={required}
          {...fieldErrorAttributes(inputId, error)}
          autoComplete={autoComplete}
          type={show ? 'text' : 'password'}
          maxLength={4096}
          value={value}
          onChange={(e) => updateFormData(field, e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`flex h-12 w-full items-center justify-start rounded-xl border p-3 py-2 pr-14 text-sm outline-none transition-colors focus:outline-none focus:ring-1 focus:ring-brand-500 ${
            error
              ? 'border-red-500 bg-red-50'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        />
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="absolute right-0.5 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-lg text-slate-600 transition-colors hover:text-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-700"
          aria-label={show ? auth.login.hidePassword : auth.login.showPassword}
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>

      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export { PasswordField };
