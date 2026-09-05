'use client';

import { LuImage, LuTrash2, LuUpload } from 'react-icons/lu';

import { AlertBanner } from '../../../ui/AlertBanner';
import { useUploadStorageFile } from '../../storageFiles/hooks';
import type { CoverImage } from '../types';

type CoverImageUploaderProps = {
  value: CoverImage;
  onChange: (fileKey: string | null) => void;
  disabled?: boolean;
};

/** Applies the presigned-URL upload flow built for Storage Files
 * (features/storageFiles/hooks/useUploadStorageFile) to a blog post's
 * cover_image field — same two-step request-then-upload-to-storage
 * request, just wired to `cover_image` instead of a standalone
 * FileRecord browser. A cross-feature import, mirroring the backend's
 * own apps.blogs.serializers importing StorageFileField from
 * apps.storage.serializers. */
const CoverImageUploader = ({
  value,
  onChange,
  disabled = false,
}: CoverImageUploaderProps) => {
  const { execute: upload, loading: uploading, error } = useUploadStorageFile();

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
    <div className="mb-4" data-field="cover_image">
      <label className="block text-sm font-medium text-slate-900">
        Cover image
      </label>

      <div className="mt-2">
        <AlertBanner message={error} />

        {value ? (
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
            {value.public_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value.public_url}
                alt="Cover"
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
              aria-label="Remove cover image"
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LuTrash2 className="size-4" />
            </button>
          </div>
        ) : (
          <label
            htmlFor="cover-image-input"
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
          id="cover-image-input"
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

export { CoverImageUploader };
