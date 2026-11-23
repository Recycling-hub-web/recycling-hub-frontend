'use client';

import { useId } from 'react';
import { LuUpload } from 'react-icons/lu';

type Props = {
  label: string;
  accessibleLabel: string;
  disabled?: boolean;
  required?: boolean;
  busy?: boolean;
  error?: string;
  description?: string;
  onSelect: (file: File) => void;
};

/** Native picker with a visible focus target and linked field feedback. */
export const PhotoPicker = ({
  label,
  accessibleLabel,
  disabled,
  required,
  busy,
  error,
  description,
  onSelect,
}: Props) => {
  const id = useId();
  const describedBy =
    [description && `${id}-help`, error && `${id}-error`]
      .filter(Boolean)
      .join(' ') || undefined;
  return (
    <div>
      <label
        htmlFor={id}
        className={`inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-700 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-brand-300 hover:bg-slate-50'}`}
      >
        <input
          id={id}
          type="file"
          accept="image/*"
          className="sr-only"
          aria-label={accessibleLabel}
          aria-required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          aria-busy={busy}
          disabled={disabled}
          onChange={(event) => {
            const input = event.currentTarget;
            const file = input.files?.[0];
            input.value = '';
            if (file) onSelect(file);
          }}
        />
        <LuUpload className="size-4" aria-hidden="true" />
        <span role={busy ? 'status' : undefined}>{label}</span>
      </label>
      {description && (
        <p id={`${id}-help`} className="mt-1 text-xs text-slate-600">
          {description}
        </p>
      )}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1 text-xs text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
};
