'use client';

import { LuImage, LuTrash2, LuUpload } from 'react-icons/lu';

import { AlertBanner } from '../../../ui/AlertBanner';
import { useUploadStorageFile } from '../hooks';

type StoredImage = { file_key: string; public_url: string | null } | null;

type ImageFileUploaderProps = {
  label: string;
  /** data-field and the file input's id — one per form. */
  field: string;
  value: StoredImage;
  /** The uploaded file's storage key, or null when removed. */
  onChange: (value: StoredImage) => void;
  disabled?: boolean;
  helperText?: string;
};

/** One optional image for any record that stores a storage key
 * (StorageFileField on the backend): uploads through the same presigned
 * flow as the Storage Files page, previews it, and can remove it. Lives
 * here, next to the upload hook it wraps, so other features import it
 * the same way they import useUploadStorageFile. */
const ImageFileUploader = ({
  label,
  field,
  value,
  onChange,
  disabled = false,
  helperText,
}: ImageFileUploaderProps) => {
  const { execute: upload, loading: uploading, error } = useUploadStorageFile();
  const inputId = `${field}-input`;

  const handleFileChange = async (file: File | undefined) => {
    if (!file) return;
    try {
      const result = await upload(file);
      onChange({ file_key: result.file_key, public_url: result.public_url });
    } catch {
      // useUploadStorageFile already captured the message in `error`.
    }
  };

  return (
    <div className="mb-4" data-field={field}>
      <label className="block text-sm font-medium text-slate-900">
        {label}
      </label>
      {helperText && (
        <p className="mt-0.5 text-xs text-slate-500">{helperText}</p>
      )}

      <div className="mt-2">
        <AlertBanner message={error} />

        {value ? (
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
            {value.public_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value.public_url}
                alt={label}
                className="size-14 shrink-0 rounded-lg object-cover"
              />
            ) : (
              <span className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                <LuImage className="size-5" />
              </span>
            )}
            <span className="min-w-0 flex-1 truncate text-sm text-slate-600">
              {value.file_key}
            </span>
            <button
              type="button"
              onClick={() => onChange(null)}
              disabled={disabled || uploading}
              aria-label={`Remove ${label.toLowerCase()}`}
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LuTrash2 className="size-4" />
            </button>
          </div>
        ) : (
          <label
            htmlFor={inputId}
            className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 px-4 py-6 text-center transition hover:border-brand-300 hover:bg-slate-50 ${
              disabled || uploading ? 'pointer-events-none opacity-50' : ''
            }`}
          >
            <LuUpload className="size-4 text-slate-400" />
            <span className="text-sm text-slate-500">
              {uploading ? 'Uploading…' : 'Click to choose an image'}
            </span>
          </label>
        )}
        <input
          id={inputId}
          type="file"
          accept="image/*"
          className="sr-only"
          disabled={disabled || uploading}
          onChange={(e) => {
            handleFileChange(e.target.files?.[0]);
            // Picking the same file again after removing it still fires.
            e.target.value = '';
          }}
        />
      </div>
    </div>
  );
};

export { ImageFileUploader };
export type { ImageFileUploaderProps, StoredImage };
