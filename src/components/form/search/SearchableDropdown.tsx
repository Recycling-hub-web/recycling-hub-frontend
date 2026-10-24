'use client';

import { ChevronDown } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { getNestedValue } from '../utils';

type SearchableDropdownOption = { value: string | number; label: string };

type SearchableDropdownProps = {
  label: string;
  field: string;
  dataField?: string;
  options?: SearchableDropdownOption[];
  required?: boolean;
  formData: Record<string, unknown>;
  errors?: Record<string, string>;
  updateFormData: (field: string, value: string | number) => void;
  placeholder?: string;
  disabledOptions?: (string | number)[];
  onSelect?: (value: string | number) => void;
  onBlur?: () => void;
};

/** Single-value searchable dropdown, closes on select. */
const SearchableDropdown = ({
  label,
  field,
  dataField,
  options = [],
  required = true,
  formData,
  errors,
  updateFormData,
  placeholder = 'Select...',
  disabledOptions = [],
  onSelect,
  onBlur,
}: SearchableDropdownProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedValue =
    (getNestedValue(formData, field) as string | number | undefined) ?? '';

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selectedOption = options.find((opt) => opt.value === selectedValue);
  const selectedLabel = selectedOption?.label ?? selectedValue ?? '';

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
        onBlur?.();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onBlur]);

  const handleSelect = (option: SearchableDropdownOption) => {
    if (disabledOptions.includes(option.value)) return;
    updateFormData(field, option.value);
    setIsOpen(false);
    setSearch('');
    onSelect?.(option.value);
  };

  return (
    <div
      className="relative mb-4"
      ref={containerRef}
      data-field={dataField ?? field}
    >
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
          className={`truncate ${selectedLabel ? 'text-slate-900' : 'text-slate-400'}`}
        >
          {selectedLabel || placeholder}
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
            className="mt-2 flex h-10 w-full items-start justify-start rounded-xl border border-slate-200 p-3 py-2 text-sm outline-none transition-colors hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />

          <ul className="max-h-40 overflow-y-auto text-sm">
            {filteredOptions.map((opt) => {
              const isDisabled = disabledOptions.includes(opt.value);

              return (
                <li
                  key={opt.value}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    if (!isDisabled) handleSelect(opt);
                  }}
                  className={`mt-2 flex h-10 w-full items-center justify-start rounded-md border p-3 py-2 text-sm transition-colors ${
                    isDisabled
                      ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                      : 'cursor-pointer hover:bg-brand-100'
                  }`}
                >
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

export { SearchableDropdown };
export type { SearchableDropdownOption };
