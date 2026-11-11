import { useId, useState } from 'react';

import { fieldStateClasses, getNestedValue } from '../utils';
import { fieldLimit } from '../validation';

type TextareaFieldProps = {
  label: string;
  field: string;
  required?: boolean;
  placeholder?: string;
  formData: Record<string, unknown>;
  errors?: Record<string, string>;
  updateFormData: (field: string, value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
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
  disabled = false,
}: TextareaFieldProps) => {
  const inputId = useId();
  const value = (getNestedValue(formData, field) as string | undefined) ?? '';
  const collapsible = !required && /(?:^|_)(?:note|notes)$/.test(field);
  const [expanded, setExpanded] = useState<boolean | null>(null);
  const showInput =
    !collapsible || (expanded ?? Boolean(value)) || Boolean(errors?.[field]);

  return (
    <div className="mb-4" data-field={field}>
      {collapsible && (
        <div className="flex min-h-11 items-center justify-between gap-3">
          <span className="text-sm font-medium text-slate-900">
            {label}{' '}
            <span className="font-normal text-slate-500">(optional)</span>
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={showInput}
            aria-label={`Show ${label.toLowerCase()}`}
            aria-controls={`${inputId}-panel`}
            disabled={disabled}
            onClick={() => setExpanded(!showInput)}
            className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none ${showInput ? 'bg-brand-600' : 'bg-slate-300'}`}
          >
            <span
              className={`size-5 rounded-full bg-white transition-transform duration-200 motion-reduce:transition-none ${showInput ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
        </div>
      )}
      <div
        id={`${inputId}-panel`}
        className={collapsible ? 'note-field-panel' : undefined}
        data-expanded={showInput}
        aria-hidden={!showInput}
      >
        <div className={collapsible ? 'min-h-0 overflow-hidden' : undefined}>
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-900"
          >
            {label} {required && <span className="text-red-600">*</span>}
          </label>

          <textarea
            id={inputId}
            name={field}
            required={required}
            aria-required={required}
            maxLength={fieldLimit(field, true)}
            value={value}
            onChange={(e) => updateFormData(field, e.target.value)}
            onBlur={onBlur}
            disabled={disabled || !showInput}
            placeholder={placeholder}
            className={`mt-2 min-h-[96px] w-full resize-y rounded-xl border p-3 text-sm outline-none transition-colors focus:outline-none focus:ring-1 focus:ring-brand-500 ${fieldStateClasses(disabled, Boolean(errors?.[field]))}`}
          />

          {errors?.[field] && (
            <p className="mt-1 text-xs text-red-600">{errors[field]}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export { TextareaField };
