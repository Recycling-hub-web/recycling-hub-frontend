'use client';

import { ChevronDown } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { getNestedValue } from '../utils';

type MultiSelectOption = { value: string | number; label: string };

type MultiSelectProps = {
  label: string;
  field: string;
  options?: MultiSelectOption[];
  required?: boolean;
  formData: Record<string, unknown>;
  errors?: Record<string, string>;
  updateFormData: (field: string, value: (string | number)[]) => void;
  placeholder?: string;
  disabledOptions?: (string | number)[];
};

/** Multi-value searchable dropdown — selected options render as a checklist,
 * clicking one toggles it in/out of the array rather than closing the menu. */
const MultiSelect = ({
  label,
  field,
  options = [],
  required = true,
  formData,
  errors,
  updateFormData,
  placeholder = 'Select...',
  disabledOptions = [],
}: MultiSelectProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selectedValues =
    (getNestedValue(formData, field) as (string | number)[] | undefined) ?? [];
  const selectedLabels = options
    .filter((opt) => selectedValues.includes(opt.value))
    .map((opt) => opt.label);

  const filteredOptions = useMemo(
    () =>
      options.filter(
        (opt) =>
          opt.label && opt.label.toLowerCase().includes(search.toLowerCase()),
      ),
    [search, options],
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: MultiSelectOption) => {
    if (disabledOptions.includes(option.value)) return;

    const next = selectedValues.includes(option.value)
      ? selectedValues.filter((v) => v !== option.value)
      : [...selectedValues, option.value];
    updateFormData(field, next);
  };

  return (
    <div className="relative mb-4" ref={containerRef} data-field={field}>
      <label className="block text-sm font-medium text-slate-900">
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className={`mt-2 flex h-12 w-full cursor-pointer items-center justify-between rounded-xl border p-3 py-2 text-sm outline-none transition-colors focus:outline-none focus:ring-1 focus:ring-brand-500 ${
          errors?.[field]
            ? 'border-red-500 bg-red-50'
            : 'border-slate-200 bg-white hover:bg-slate-50'
        }`}
      >
        <span
          className={`truncate ${selectedLabels.length ? 'text-slate-900' : 'text-slate-400'}`}
        >
          {selectedLabels.length ? selectedLabels.join(', ') : placeholder}
        </span>
        <ChevronDown className="size-5 shrink-0 text-slate-500" />
      </div>

      {isOpen && (
        <div
          className="absolute z-20 mt-1 rounded-md border border-slate-200 bg-white p-3 shadow-lg"
          style={{
            width: containerRef.current
              ? containerRef.current.offsetWidth
              : '100%',
          }}
        >
          <input
            type="text"
            placeholder="Search..."
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-2 flex h-10 w-full items-start justify-between rounded-xl border border-slate-200 p-3 py-2 text-sm outline-none transition-colors hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />

          <ul className="max-h-40 overflow-y-auto text-sm">
            {filteredOptions.map((opt) => {
              const isDisabled = disabledOptions.includes(opt.value);

              return (
                <li
                  key={opt.value}
                  onClick={() => !isDisabled && handleSelect(opt)}
                  className={`mt-2 flex h-10 w-full items-center gap-2 rounded-md border px-3 py-2 text-sm ${
                    isDisabled
                      ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                      : 'cursor-pointer hover:bg-brand-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(opt.value)}
                    readOnly
                  />
                  {opt.label}
                </li>
              );
            })}

            {!filteredOptions.length && (
              <div className="mt-2 border-t pt-2">
                <li className="px-3 py-2 text-slate-400">No results found</li>
              </div>
            )}
          </ul>
        </div>
      )}

      {errors?.[field] && (
        <p className="mt-1 text-xs text-red-600">{errors[field]}</p>
      )}
    </div>
  );
};

export { MultiSelect };
export type { MultiSelectOption };
