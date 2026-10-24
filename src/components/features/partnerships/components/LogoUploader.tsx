'use client';

import { LuImage, LuUpload } from 'react-icons/lu';

import { AlertBanner } from '../../../ui/AlertBanner';
import { useUploadStorageFile } from '../../storageFiles/hooks';

type Logo = { file_key: string; public_url: string | null } | null;

type LogoUploaderProps = {
  value: Logo;
  onChange: (fileKey: string) => void;
  disabled?: boolean;
};

/** Applies Storage Files' presigned-upload flow
 * (features/storageFiles/hooks/useUploadStorageFile) to a partner's logo —
 * same cross-feature reuse as CoverImageUploader/ProfilePhotoUploader, a
 * contained square preview instead of a rectangular cover or circular
 * avatar. Unlike those two, `logo` is required on the backend (no
 * `allow_blank`/`allow_null` — confirmed live: creating without one 400s
 * with "This field is required.") — no remove button, only
 * upload/replace, since clearing it would leave an invalid form state. */
const LogoUploader = ({
  value,
  onChange,
  disabled = false,
}: LogoUploaderProps) => {
  const { execute: upload, loading: uploading, error } = useUploadStorageFile();

  let uploadLabel = 'Upload logo';
  if (uploading) uploadLabel = 'Uploading…';
  else if (value) uploadLabel = 'Replace logo';

  const handleFileChange = async (file: File | undefined) => {
    if (!file) return;
    try {
      const result = await upload(file);
      onChange(result.file_key);
    } catch {
      // useUploadStorageFile already captured the message in `error`,
      // shown below.
    }
  };

  return (
    <div className="mb-4" data-field="logo">
      <label className="block text-sm font-medium text-slate-900">
        Logo <span className="text-red-600">*</span>
      </label>

      <div className="mt-2">
        <AlertBanner message={error} />

        <div className="flex items-center gap-4">
          {value?.public_url ? (
            // eslint-disable-next-line @next/next/no-img-element -- remote/presigned URL, not a static asset
            <img
              src={value.public_url}
              alt=""
              className="size-16 shrink-0 rounded-xl border border-slate-200 object-contain p-1.5"
            />
          ) : (
            <span className="flex size-16 shrink-0 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-slate-400">
              <LuImage className="size-6" />
            </span>
          )}

          <label
            htmlFor="partner-logo-input"
            className={`flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-300 hover:bg-slate-50 ${
              disabled || uploading ? 'pointer-events-none opacity-50' : ''
            }`}
          >
            <LuUpload className="size-4" />
            {uploadLabel}
          </label>
        </div>
        <input
          id="partner-logo-input"
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

export { LogoUploader };
export type { Logo };
