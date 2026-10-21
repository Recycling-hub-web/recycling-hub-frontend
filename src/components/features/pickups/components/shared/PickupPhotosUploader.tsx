'use client';

import { LuImage, LuUpload, LuX } from 'react-icons/lu';

import { AlertBanner } from '../../../../ui/AlertBanner';
import { useUploadStorageFile } from '../../../storageFiles/hooks';

const MAX_ORDER_PHOTOS = 4;

type OrderPhoto = { file_key: string; public_url: string | null };

type PickupPhotosUploaderProps = {
  value: OrderPhoto[];
  onChange: (photos: OrderPhoto[]) => void;
  disabled?: boolean;
};

/** Up to MAX_ORDER_PHOTOS reference photos for an Order, attached only
 * at creation (see CreateOrderView — there's no later photo-adding
 * path, so no cumulative-count tracking beyond this component's own
 * array). Generalizes the old single-photo PickupPhotoUploader (which
 * used the public, AllowAny upload endpoint for the now-removed public
 * photo field) into the authenticated, admin/staff-only multi-photo
 * case via the generic useUploadStorageFile — Order creation is
 * staff-only, so there's no anonymous-caller concern here. */
const PickupPhotosUploader = ({
  value,
  onChange,
  disabled = false,
}: PickupPhotosUploaderProps) => {
  const { execute: upload, loading: uploading, error } = useUploadStorageFile();

  const atCap = value.length >= MAX_ORDER_PHOTOS;

  const handleFileChange = async (file: File | undefined) => {
    if (!file || atCap) return;
    try {
      const result = await upload(file);
      onChange([
        ...value,
        { file_key: result.file_key, public_url: result.public_url },
      ]);
    } catch {
      // useUploadStorageFile already captured the message in `error`,
      // shown below.
    }
  };

  const removeAt = (index: number) =>
    onChange(value.filter((_, i) => i !== index));

  return (
    <div className="mb-4" data-field="photos">
      <label className="block text-sm font-medium text-slate-900">
        Photos{' '}
        <span className="font-normal text-slate-400">
          (optional, up to {MAX_ORDER_PHOTOS})
        </span>
      </label>

      <div className="mt-2">
        <AlertBanner message={error} />

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
              htmlFor="order-photos-input"
              className={`flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-300 hover:bg-slate-50 ${
                disabled || uploading ? 'pointer-events-none opacity-50' : ''
              }`}
            >
              <LuUpload className="size-4" />
              {uploading ? 'Uploading…' : 'Add photo'}
            </label>
          )}
        </div>
        <input
          id="order-photos-input"
          type="file"
          accept="image/*"
          className="sr-only"
          disabled={disabled || uploading || atCap}
          onChange={(e) => {
            handleFileChange(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
      </div>
    </div>
  );
};

export { PickupPhotosUploader };
export type { OrderPhoto };
