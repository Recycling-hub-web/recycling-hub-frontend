'use client';

import { LuImage, LuUpload, LuX } from 'react-icons/lu';

import { AlertBanner } from '../../../ui/AlertBanner';
import { usePickupPhotoUpload } from '../hooks';

type Photo = { file_key: string; public_url: string | null } | null;

type PickupPhotoUploaderProps = {
  value: Photo;
  onChange: (fileKey: string | null) => void;
  disabled?: boolean;
};

/** Applies Storage Files' presigned-upload flow (same as LogoUploader)
 * to an optional photo of the item(s) to be collected — unlike a
 * required logo, this one has a remove button, since clearing it is a
 * valid state rather than leaving the form invalid. */
const PickupPhotoUploader = ({
  value,
  onChange,
  disabled = false,
}: PickupPhotoUploaderProps) => {
  const { execute: upload, loading: uploading, error } = usePickupPhotoUpload();

  let uploadLabel = 'Upload photo';
  if (uploading) uploadLabel = 'Uploading…';
  else if (value) uploadLabel = 'Replace photo';

  const handleFileChange = async (file: File | undefined) => {
    if (!file) return;
    try {
      const result = await upload(file);
      onChange(result.file_key);
    } catch {
      // usePickupPhotoUpload already captured the message in `error`,
      // shown below.
    }
  };

  return (
    <div className="mb-4" data-field="photo">
      <label className="block text-sm font-medium text-slate-900">
        Photo <span className="font-normal text-slate-400">(optional)</span>
      </label>

      <div className="mt-2">
        <AlertBanner message={error} />

        <div className="flex items-center gap-4">
          {value?.public_url ? (
            // eslint-disable-next-line @next/next/no-img-element -- remote/presigned URL, not a static asset
            <img
              src={value.public_url}
              alt=""
              className="size-16 shrink-0 rounded-xl border border-slate-200 object-cover"
            />
          ) : (
            <span className="flex size-16 shrink-0 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-slate-400">
              <LuImage className="size-6" />
            </span>
          )}

          <label
            htmlFor="pickup-photo-input"
            className={`flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-300 hover:bg-slate-50 ${
              disabled || uploading ? 'pointer-events-none opacity-50' : ''
            }`}
          >
            <LuUpload className="size-4" />
            {uploadLabel}
          </label>

          {value && !uploading && (
            <button
              type="button"
              onClick={() => onChange(null)}
              disabled={disabled}
              className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LuX className="size-4" />
              Remove
            </button>
          )}
        </div>
        <input
          id="pickup-photo-input"
          type="file"
          accept="image/*"
          className="sr-only"
          disabled={disabled || uploading}
          onChange={(e) => handleFileChange(e.target.files?.[0])}
        />
      </div>
    </div>
  );
};

export { PickupPhotoUploader };
export type { Photo };
