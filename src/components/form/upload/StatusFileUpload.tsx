import { Trash2 } from 'lucide-react';
import { useState } from 'react';

import { ALLOWED_FILE_TYPES } from '../../../constants/uploads';
import { useToast } from '../../ui/toast/ToastContext';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

type StatusFileUploadProps = {
  label: string;
  description?: string;
  id: string;
  file: File | null;
  onFileChange: (file: File) => void;
  onRemove: () => void;
  onError?: (msg: string) => void;
  disabled?: boolean;
  required?: boolean;
  uploading?: boolean;
  progress?: number;
  compact?: boolean;
};

const StatusFileUpload = ({
  label,
  description,
  id,
  file,
  onFileChange,
  onRemove,
  onError,
  disabled = false,
  required = false,
  uploading = false,
  progress,
  compact = false,
}: StatusFileUploadProps) => {
  const toast = useToast();
  const [validationError, setValidationError] = useState('');
  const unavailable = disabled || uploading;
  const safeProgress =
    progress === undefined ? undefined : Math.min(100, Math.max(0, progress));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const isAllowed =
      ALLOWED_FILE_TYPES.mimeTypes.includes(selected.type) ||
      ALLOWED_FILE_TYPES.extensions.some((ext) =>
        selected.name.toLowerCase().endsWith(ext),
      );

    if (!isAllowed) {
      const msg = `Invalid file type "${selected.name}". Only ${ALLOWED_FILE_TYPES.label} files are allowed.`;
      setValidationError(msg);
      toast.error('Invalid file type', msg);
      onError?.(msg);
      e.target.value = '';
      return;
    }

    if (selected.size > MAX_FILE_SIZE) {
      const msg = 'File size must not exceed 10MB.';
      setValidationError(msg);
      toast.error('File too large', msg);
      onError?.(msg);
      e.target.value = '';
      return;
    }

    setValidationError('');
    onError?.('');
    onFileChange(selected);
    e.target.value = '';
  };

  return (
    <div className="space-y-2">
      <div>
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-900"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {description && (
          <p id={`${id}-description`} className="mt-0.5 text-xs text-slate-600">
            {description}
          </p>
        )}
      </div>

      <label
        htmlFor={id}
        className={`group relative flex cursor-pointer focus-within:ring-2 focus-within:ring-brand-700 focus-within:ring-offset-2 ${unavailable ? 'cursor-not-allowed opacity-60' : ''} flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white px-6 text-center transition-all duration-200 hover:border-brand-500 hover:bg-brand-50/40 ${compact ? 'py-4' : 'py-10'}`}
      >
        <div
          className={`flex items-center justify-center rounded-lg bg-brand-100 text-brand-600 transition ${compact ? 'mb-2 size-10' : 'mb-4 size-14'}`}
        >
          <svg
            className="size-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 16V8m0 0l-3 3m3-3l3 3M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
            />
          </svg>
        </div>

        <p className="text-sm font-semibold text-slate-800">{label}</p>
        <p id={`${id}-requirements`} className="mt-2 text-xs text-slate-600">
          {ALLOWED_FILE_TYPES.label} – Max 10MB
        </p>

        <input
          id={id}
          type="file"
          accept={ALLOWED_FILE_TYPES.extensions.join(',')}
          className="sr-only"
          aria-label={label}
          aria-required={required}
          aria-invalid={Boolean(validationError)}
          aria-describedby={`${id}-requirements${description ? ` ${id}-description` : ''}${validationError ? ` ${id}-error` : ''}`}
          disabled={unavailable}
          onChange={handleChange}
        />
      </label>

      {validationError && (
        <p id={`${id}-error`} role="alert" className="text-sm text-red-700">
          {validationError}
        </p>
      )}

      {file && (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <div className="flex items-center justify-between">
            <span
              role="status"
              className="min-w-0 truncate text-sm text-slate-600"
            >
              {file.name}
            </span>
            {!uploading && (
              <button
                type="button"
                onClick={onRemove}
                disabled={unavailable}
                className="flex items-center justify-center gap-2 rounded-lg border border-red-600 px-4 py-2 text-sm font-medium text-red-600 transition hover:border-red-700 hover:text-red-700 disabled:opacity-50"
              >
                <Trash2 className="size-4" />
                Remove
              </button>
            )}
            {uploading && (
              <span className="text-xs font-medium text-brand-600">
                {safeProgress === undefined ? 'Uploading…' : `${safeProgress}%`}
              </span>
            )}
          </div>

          {uploading && (
            <div
              role="progressbar"
              aria-label={`Uploading ${file.name}`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={safeProgress}
              className="mt-3 h-1.5 w-full rounded-lg bg-slate-100"
            >
              <div
                className="h-full rounded-lg bg-brand-500 transition-all duration-300"
                style={{
                  width:
                    safeProgress === undefined ? '100%' : `${safeProgress}%`,
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export { StatusFileUpload };
