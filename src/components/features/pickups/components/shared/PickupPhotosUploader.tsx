'use client';

import { useId, useState } from 'react';
import { LuImage, LuUpload, LuX } from 'react-icons/lu';

import { ApiError } from '../../../../../lib/api';
import { AlertBanner } from '../../../../ui/AlertBanner';
import { useUploadStorageFile } from '../../../storageFiles/hooks';

const MAX_ORDER_PHOTOS = 4;

type OrderPhoto = { file_key: string; public_url: string | null };

type PickupPhotosUploaderProps = {
  value: OrderPhoto[];
  onChange: (photos: OrderPhoto[]) => void;
  disabled?: boolean;
  /** At least one photo is needed — shows the required mark. */
  required?: boolean;
  /** Shown under the photos, e.g. "Add at least one photo." */
  error?: string;
  label?: string;
  helperText?: string;
  addLabel?: string;
  /** How to upload one file. Defaults to the signed-in storage flow;
   * the public form passes its own anonymous upload. */
  upload?: (file: File) => Promise<OrderPhoto>;
};

/** 1–MAX_ORDER_PHOTOS photos: an Order's reference photos (CreateOrderView,
 * NewOrdersFieldArray) and the public form's photos of what to collect
 * (PublicPickupRequestForm). Each instance gets its own input id, so
 * several on one page (one per draft order) don't open each other's
 * file picker. */
const PickupPhotosUploader = ({
  value,
  onChange,
  disabled = false,
  required = true,
  error,
  label = 'Photos',
  helperText,
  addLabel = 'Add photo',
  upload,
}: PickupPhotosUploaderProps) => {
  const inputId = useId();
  const { execute: storageUpload } = useUploadStorageFile();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const atCap = value.length >= MAX_ORDER_PHOTOS;

  const handleFileChange = async (file: File | undefined) => {
    if (!file || atCap) return;
    setUploading(true);
    setUploadError('');
    try {
      const photo = upload
        ? await upload(file)
        : await storageUpload(file).then((result) => ({
            file_key: result.file_key,
            public_url: result.public_url,
          }));
      onChange([...value, photo]);
    } catch (err) {
      setUploadError(
        err instanceof ApiError ? err.message : 'Could not upload the photo.',
      );
    } finally {
      setUploading(false);
    }
  };

  const removeAt = (index: number) =>
    onChange(value.filter((_, i) => i !== index));

  return (
    <div className="mb-4" data-field="photos">
      <label className="block text-sm font-medium text-slate-900">
        {label} {required && <span className="text-red-600">*</span>}{' '}
        <span className="font-normal text-slate-400">
          ({required ? 1 : 0}–{MAX_ORDER_PHOTOS})
        </span>
      </label>
      {helperText && (
        <p className="mt-0.5 text-xs text-slate-500">{helperText}</p>
      )}

      <div className="mt-2">
        <AlertBanner message={uploadError} />

        <div className="flex flex-wrap items-center gap-3">
          {value.map((photo, index) => (
            <div key={photo.file_key} className="group relative">
              {photo.public_url ? (
                // eslint-disable-next-line @next/next/no-img-element -- remote/presigned URL, not a static asset
                <img
                  src={photo.public_url}
                  alt=""
                  className="size-16 rounded-xl border border-slate-200 object-cover"
                />
              ) : (
                <span className="flex size-16 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-slate-400">
                  <LuImage className="size-6" />
                </span>
              )}
              <button
                type="button"
                onClick={() => removeAt(index)}
                disabled={disabled}
                aria-label={`Remove photo ${index + 1}`}
                className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-white text-slate-500 shadow ring-1 ring-slate-200 transition hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <LuX className="size-3" />
              </button>
            </div>
          ))}

          {!atCap && (
            <label
              htmlFor={inputId}
              className={`flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-300 hover:bg-slate-50 ${
                disabled || uploading ? 'pointer-events-none opacity-50' : ''
              }`}
            >
              <LuUpload className="size-4" />
              {uploading ? 'Uploading…' : addLabel}
            </label>
          )}
        </div>
        <input
          id={inputId}
          type="file"
          accept="image/*"
          className="sr-only"
          disabled={disabled || uploading || atCap}
          onChange={(e) => {
            handleFileChange(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
        {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export { MAX_ORDER_PHOTOS, PickupPhotosUploader };
export type { OrderPhoto };
