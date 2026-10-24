import { getNestedValue } from '../utils';
import type { SelectOption } from './SelectField';

type SelectInputProps = {
  field: string;
  options: SelectOption[];
  formData: Record<string, unknown>;
  errors?: Record<string, string>;
  updateFormData: (field: string, value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  className?: string;
};

/**
 * Bare dropdown — just the `<select>`, styled to match SelectField, with no
 * label or spacing wrapper. For inline pickers (e.g. a currency selector
 * sitting next to a button) where a full labeled SelectField would add
 * unwanted vertical space and a redundant caption.
 */
const SelectInput = ({
  field,
  options,
  formData,
  errors,
  updateFormData,
  onBlur,
  disabled = false,
  className = '',
}: SelectInputProps) => {
  const value = (getNestedValue(formData, field) as string | undefined) ?? '';
  const hasError = Boolean(errors?.[field]);

  return (
    <select
      value={value}
      onChange={(e) => updateFormData(field, e.target.value)}
      onBlur={onBlur}
      disabled={disabled}
      className={`flex h-10 w-full items-center justify-start rounded-xl border px-3 py-2 text-sm outline-none transition-colors focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-60 ${
        hasError
          ? 'border-red-500 bg-red-50'
          : 'border-slate-200 bg-white hover:bg-slate-50'
      } ${className}`}
    >
      {options.map((opt, index) => {
        const optValue = typeof opt === 'object' ? opt.value : opt;
        const optLabel = typeof opt === 'object' ? opt.label : opt;
        return (
          <option key={`${optValue}-${index}`} value={optValue}>
            {optLabel}
          </option>
        );
      })}
    </select>
  );
};

export { SelectInput };
