import type { ReactNode } from 'react';
import { LuChevronDown } from 'react-icons/lu';

type FilterSelectOption = {
  value: string;
  label: string;
};

type FilterSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: FilterSelectOption[];
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
};

const FilterSelect = ({
  value,
  onChange,
  options,
  icon,
  disabled = false,
  className = '',
}: FilterSelectProps) => (
  <div className={`relative inline-flex items-center ${className}`}>
    {icon && (
      <span className="pointer-events-none absolute left-3.5 top-1/2 flex -translate-y-1/2 items-center text-slate-400">
        {icon}
      </span>
    )}

    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`inline-flex w-full min-w-0 max-w-full cursor-pointer appearance-none items-center justify-center rounded-full border border-slate-200 bg-slate-50 py-2.5 pr-9 text-sm font-medium text-slate-700 outline-none transition-colors duration-200 ease-in-out hover:bg-slate-100/50 focus:border-brand-600 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 ${
        icon ? 'pl-9' : 'pl-5'
      }`}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>

    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
      <LuChevronDown className="size-4" />
    </span>
  </div>
);

export { FilterSelect };
export type { FilterSelectOption, FilterSelectProps };
