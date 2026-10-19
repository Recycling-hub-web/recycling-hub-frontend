'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { LuLoaderCircle, LuMapPin, LuX } from 'react-icons/lu';

import {
  GeoapifyConfigError,
  type GeoapifyFeature,
  searchAddress,
  type SelectedAddress,
  toSelectedAddress,
} from '../../../lib/geoapify';
import { fieldStateClasses, getNestedValue } from '../utils';

const DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 3;

type AddressInputProps = {
  label: string;
  /** formData key the formatted address text is written to — same
   * convention as InputField, so this drops into an existing form by
   * swapping the component without renaming anything. */
  field: string;
  dataField?: string;
  required?: boolean;
  placeholder?: string;
  formData: Record<string, unknown>;
  errors?: Record<string, string>;
  updateFormData: (field: string, value: string) => void;
  disabled?: boolean;
  /** Fires only on a real suggestion pick, with the full structured
   * result — free-text typing alone never calls this (see the
   * verified/stale-on-edit handling below). */
  onSelect?: (location: SelectedAddress) => void;
  /** Fires when a previously-selected address is cleared (either via the
   * clear button or by editing the text after a selection). */
  onClear?: () => void;
  /** Restrict suggestions to these countries, e.g. ["my"]. */
  countryRestrictions?: string[];
  /** Nudges ranking toward this point without excluding results
   * elsewhere (Geoapify's `bias`, not a hard filter). */
  defaultLocation?: { lat: number; lng: number };
  className?: string;
};

/** Address input with live Geoapify autocomplete — search by street
 * address, business name, or landmark, pick a suggestion, get back a
 * structured, verified location (lat/lng, place id, address parts).
 * Plain typing alone never counts as "verified": the moment the text
 * changes after a selection, the stale coordinates/placeId are dropped
 * and `onClear` fires, so a parent can't accidentally submit an old
 * selection's lat/lng next to new, unverified text.
 *
 * Usage (same shape as InputField, plus `onSelect` for the full object):
 *   <AddressInput
 *     label="Pickup address"
 *     field="pickup_address"
 *     formData={formData}
 *     errors={errors}
 *     updateFormData={updateFormData}
 *     countryRestrictions={['my']}
 *     onSelect={(location) => setSelectedLocation(location)}
 *     onClear={() => setSelectedLocation(null)}
 *   />
 */
const AddressInput = ({
  label,
  field,
  dataField,
  required = true,
  placeholder = 'Search for an address, business, or landmark…',
  formData,
  errors,
  updateFormData,
  disabled = false,
  onSelect,
  onClear,
  countryRestrictions,
  defaultLocation,
  className = '',
}: AddressInputProps) => {
  const value = (getNestedValue(formData, field) as string | undefined) ?? '';
  const error = errors?.[field];
  const listboxId = useId();

  const [suggestions, setSuggestions] = useState<GeoapifyFeature[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [verified, setVerified] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const abortRef = useRef<AbortController>();

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  // Cancel any in-flight debounce/request on unmount so a late response
  // can't call setState after this input's gone.
  useEffect(
    () => () => {
      clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    },
    [],
  );

  const runSearch = (query: string) => {
    clearTimeout(debounceRef.current);
    abortRef.current?.abort();

    if (query.trim().length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);
      setSearchError('');
      try {
        const results = await searchAddress(query, {
          countryCodes: countryRestrictions,
          bias: defaultLocation,
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;
        setSuggestions(results);
        setOpen(true);
        setHighlighted(-1);
      } catch (err) {
        if (controller.signal.aborted) return;
        setSuggestions([]);
        setSearchError(
          err instanceof GeoapifyConfigError
            ? 'Address search is not configured.'
            : "Couldn't search for addresses. Please try again.",
        );
        setOpen(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, DEBOUNCE_MS);
  };

  const handleChange = (text: string) => {
    updateFormData(field, text);
    if (verified) {
      // The confirmed selection no longer matches what's on screen —
      // drop it rather than let a parent submit stale coordinates next
      // to edited text.
      setVerified(false);
      onClear?.();
    }
    runSearch(text);
  };

  const handleSelect = (feature: GeoapifyFeature) => {
    const location = toSelectedAddress(feature);
    updateFormData(field, location.formattedAddress);
    setVerified(true);
    setOpen(false);
    setSuggestions([]);
    onSelect?.(location);
  };

  const handleClear = () => {
    updateFormData(field, '');
    setVerified(false);
    setSuggestions([]);
    setOpen(false);
    setSearchError('');
    onClear?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted((i) => (i + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === 'Enter') {
      const chosen = suggestions[highlighted];
      if (chosen) {
        e.preventDefault();
        handleSelect(chosen);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const renderDropdownContent = () => {
    if (searchError) {
      return <p className="px-4 py-3 text-sm text-red-600">{searchError}</p>;
    }
    if (suggestions.length === 0) {
      return (
        <p className="px-4 py-3 text-sm text-slate-500">No addresses found.</p>
      );
    }
    return (
      <ul
        id={listboxId}
        role="listbox"
        className="max-h-72 overflow-y-auto py-1"
      >
        {suggestions.map((feature, i) => (
          <li
            key={feature.place_id}
            role="option"
            aria-selected={i === highlighted}
          >
            <button
              type="button"
              onClick={() => handleSelect(feature)}
              onMouseEnter={() => setHighlighted(i)}
              className={`flex w-full flex-col items-start gap-0.5 px-4 py-2.5 text-left transition-colors ${
                i === highlighted ? 'bg-brand-50' : 'hover:bg-slate-50'
              }`}
            >
              {feature.name && (
                <span className="text-sm font-medium text-slate-900">
                  {feature.name}
                </span>
              )}
              <span
                className={
                  feature.name
                    ? 'text-xs text-slate-500'
                    : 'text-sm text-slate-900'
                }
              >
                {feature.formatted}
              </span>
            </button>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className={`mb-4 ${className}`} data-field={dataField ?? field}>
      <label className="block text-sm font-medium text-slate-900">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <div className="relative mt-2" ref={wrapperRef}>
        <LuMapPin
          className="pointer-events-none absolute start-0 top-1/2 ms-3.5 size-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <input
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          aria-controls={listboxId}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={`flex h-12 w-full items-center justify-start rounded-xl border p-3 py-2 ps-10 text-sm outline-none transition-colors focus:outline-none focus:ring-1 focus:ring-brand-500 ${
            value ? 'pe-9' : ''
          } ${fieldStateClasses(disabled, Boolean(error))}`}
        />
        {verified && (
          <span className="absolute inset-y-0 end-9 flex items-center text-xs font-medium text-brand-600">
            ✓
          </span>
        )}
        {loading && (
          <LuLoaderCircle
            className="absolute end-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-slate-400"
            aria-hidden="true"
          />
        )}
        {!loading && value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear address"
            className="absolute inset-y-0 end-0 flex w-9 items-center justify-center text-slate-400 transition-colors hover:text-slate-600"
          >
            <LuX className="size-4" />
          </button>
        )}

        {open && (
          <div className="absolute z-10 mt-1.5 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
            {renderDropdownContent()}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export { AddressInput };
export type { AddressInputProps };
