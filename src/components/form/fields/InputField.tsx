import { useId } from 'react';

import { fieldStateClasses, getNestedValue } from '../utils';
import { fieldLimit } from '../validation';

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
  /** Short fixed text inside the input's leading edge, e.g. "RM". */
  prefix?: string;
  maxLength?: number;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  pattern?: string;
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
  prefix,
  maxLength,
  min,
  max,
  step,
  pattern,
}: InputFieldProps) => {
  const inputId = useId();
  const value =
    (getNestedValue(formData, field) as string | number | undefined) ?? '';
  const error = errors?.[field];

  const isAmount = [
    'price',
    'actual_amount',
    'amount_claimed',
    'amount_approved',
  ].includes(field);
  const isNonnegative =
    isAmount ||
    [
      'sort_order',
      'estimated_quantity',
      'collected_quantity',
      'delivered_quantity',
    ].includes(field);
  const numberStep = field === 'sort_order' ? '1' : 'any';
  const dateProps =
    type === 'date'
      ? { min: min ?? '1900-01-01', max: max ?? '2099-12-31' }
      : {};

  return (
    <div className="mb-4" data-field={dataField ?? field}>
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-slate-900"
      >
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      <div className="relative mt-2">
        {prefix && (
          <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5 text-sm font-medium text-slate-500">
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          name={field}
          required={required}
          aria-required={required}
          maxLength={maxLength ?? fieldLimit(field)}
          min={min ?? (isNonnegative ? 0 : undefined)}
          max={max ?? (isAmount ? 99999999.99 : undefined)}
          step={step ?? (isAmount ? '0.01' : numberStep)}
          pattern={pattern ?? (field === 'postcode' ? '[0-9]{5}' : undefined)}
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
          className={`flex h-12 w-full items-center justify-start rounded-xl border p-3 py-2 text-sm outline-none transition-colors focus:outline-none focus:ring-1 focus:ring-brand-500 ${prefix ? 'ps-11' : ''} ${fieldStateClasses(disabled, Boolean(error))}`}
        />
      </div>

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {!error && disabled && helperText && (
        <p className="mt-1 text-xs text-slate-400">{helperText}</p>
      )}
    </div>
  );
};

export { InputField };
