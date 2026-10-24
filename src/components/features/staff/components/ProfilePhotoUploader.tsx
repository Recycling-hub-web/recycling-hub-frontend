'use client';

import { LuTrash2, LuUpload, LuUser } from 'react-icons/lu';

import { AlertBanner } from '../../../ui/AlertBanner';
import { useUploadStorageFile } from '../../storageFiles/hooks';

type ProfilePhoto = { file_key: string; public_url: string | null } | null;

type ProfilePhotoUploaderProps = {
  value: ProfilePhoto;
  onChange: (fileKey: string | null) => void;
  disabled?: boolean;
};

/** Applies Storage Files' presigned-upload flow
 * (features/storageFiles/hooks/useUploadStorageFile) to a staff member's
 * profile photo — same cross-feature reuse as
 * features/blogs/components/CoverImageUploader.tsx, just a circular
 * avatar instead of a rectangular cover image. Unlike cover_image, this
 * field is `allow_null=True` on the backend (StaffCreateSerializer/
 * StaffUpdateSerializer) — clearing sends `null`, not `''`. */
const ProfilePhotoUploader = ({
  value,
  onChange,
  disabled = false,
}: ProfilePhotoUploaderProps) => {
  const { execute: upload, loading: uploading, error } = useUploadStorageFile();

  let uploadLabel = 'Upload photo';
  if (uploading) uploadLabel = 'Uploading…';
  else if (value) uploadLabel = 'Replace photo';

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
    <div className="mb-4" data-field="profile_photo">
      <label className="block text-sm font-medium text-slate-900">
        Profile photo
      </label>

      <div className="mt-2">
        <AlertBanner message={error} />

        <div className="flex items-center gap-4">
          {value?.public_url ? (
            // eslint-disable-next-line @next/next/no-img-element -- remote/presigned URL, not a static asset
            <img
              src={value.public_url}
              alt=""
              className="size-16 shrink-0 rounded-full object-cover"
            />
          ) : (
            <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <LuUser className="size-6" />
            </span>
          )}

          <div className="flex items-center gap-2">
            <label
              htmlFor="profile-photo-input"
              className={`flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-300 hover:bg-slate-50 ${
                disabled || uploading ? 'pointer-events-none opacity-50' : ''
              }`}
            >
              <LuUpload className="size-4" />
              {uploadLabel}
            </label>
            {value && (
              <button
                type="button"
                onClick={() => onChange(null)}
                disabled={disabled || uploading}
                aria-label="Remove profile photo"
                className="inline-flex size-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <LuTrash2 className="size-4" />
              </button>
            )}
          </div>
        </div>
        <input
          id="profile-photo-input"
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

export { ProfilePhotoUploader };
export type { ProfilePhoto };
