import { AlertCircle, Camera, FileCheck, Trash2, Upload } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { ALLOWED_FILE_TYPES } from '../../../constants/uploads';

const IMAGE_ONLY_TYPES = {
  mimeTypes: ['image/png', 'image/jpeg', 'image/jpg'],
  extensions: ['.png', '.jpg', '.jpeg'],
  label: 'PNG or JPG',
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;

type DocumentFile = {
  document_type_id: string | number;
  name: string;
  size?: string;
  file_key?: string;
  uploading?: boolean;
  progress?: number;
};

type ImageUploadFieldProps = {
  label?: string;
  field: string;
  // --- document-management mode ---
  documentTypeId?: string | number | null;
  formData?: Record<string, DocumentFile[]> | null;
  uploadHandler?:
    | ((
        e: React.ChangeEvent<HTMLInputElement>,
        documentTypeId: string | number,
      ) => Promise<void>)
    | null;
  removeHandler?: ((documentTypeId: string | number) => Promise<void>) | null;
  // --- simple mode ---
  simpleFile?: File | null;
  onSimpleFileChange?: ((file: File) => void) | null;
  onSimpleRemove?: (() => void) | null;
  simpleUploading?: boolean;
  simpleProgress?: number;
  // --- simple mode: existing image (update flow) ---
  existingUrl?: string | null;
  onExistingRemove?: (() => void) | null;
  // --- shared ---
  errors?: Record<string, string>;
  required?: boolean;
  multiple?: boolean;
  imageOnly?: boolean;
  accept?: string | null;
};

/**
 * Dual-mode file upload field.
 *
 * Document-management mode (default):
 *   Requires: documentTypeId, formData, uploadHandler, removeHandler
 *
 * Simple mode (single file / logo):
 *   Requires: simpleFile, onSimpleFileChange, onSimpleRemove
 *   Optional: existingUrl, onExistingRemove — for the edit/update flow
 *   Optional: imageOnly — restricts to PNG/JPG only (no PDF)
 *
 * Backend-agnostic by design — it never calls an API itself, only the
 * handler props passed in.
 */
const ImageUploadField = ({
  label,
  field,
  documentTypeId = null,
  formData = null,
  uploadHandler = null,
  removeHandler = null,
  simpleFile = null,
  onSimpleFileChange = null,
  onSimpleRemove = null,
  simpleUploading = false,
  simpleProgress = 0,
  existingUrl = null,
  onExistingRemove = null,
  errors,
  required = false,
  multiple = false,
  imageOnly = false,
  accept = null,
}: ImageUploadFieldProps) => {
  const resolvedAccept =
    accept ??
    (imageOnly
      ? IMAGE_ONLY_TYPES.extensions.join(',')
      : ALLOWED_FILE_TYPES.extensions.join(','));
  const resolvedMimeTypes = imageOnly
    ? IMAGE_ONLY_TYPES.mimeTypes
    : ALLOWED_FILE_TYPES.mimeTypes;
  const resolvedLabel = imageOnly
    ? IMAGE_ONLY_TYPES.label
    : ALLOWED_FILE_TYPES.label;

  const [fileError, setFileError] = useState('');
  const [imgError, setImgError] = useState(false);

  // Object URL created once per file, revoked on cleanup — avoids leaking
  // one blob URL per keystroke-triggered re-render.
  const previewUrl = useMemo(
    () => (simpleFile ? URL.createObjectURL(simpleFile) : null),
    [simpleFile],
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    setImgError(false);
  }, [existingUrl]);

  const isSimpleMode = !documentTypeId;
  const uploadNoun = label ? label.toLowerCase() : 'logo';

  const documents = !isSimpleMode ? formData?.[field] || [] : [];
  const docFile = !isSimpleMode
    ? documents.find((d) => d.document_type_id === documentTypeId)
    : null;

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!uploadHandler || documentTypeId === null) return;
    const selected = e.target.files?.[0];
    if (selected && !resolvedMimeTypes.includes(selected.type)) {
      setFileError(
        `Invalid file type. Only ${resolvedLabel} files are allowed.`,
      );
      e.target.value = '';
      return;
    }
    setFileError('');
    await uploadHandler(e, documentTypeId);
  };

  const handleDocRemove = async () => {
    if (!removeHandler || documentTypeId === null) return;
    await removeHandler(documentTypeId);
  };

  const handleSimpleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!resolvedMimeTypes.includes(selected.type)) {
      setFileError(
        `Invalid file type. Only ${resolvedLabel} files are allowed.`,
      );
      e.target.value = '';
      return;
    }
    if (selected.size > MAX_FILE_SIZE) {
      setFileError('File size must not exceed 10MB.');
      e.target.value = '';
      return;
    }
    setFileError('');
    onSimpleFileChange?.(selected);
    e.target.value = '';
  };

  const handleSimpleRemove = () => {
    setFileError('');
    onSimpleRemove?.();
  };

  const handleExistingRemove = () => {
    setFileError('');
    onExistingRemove?.();
  };

  const showDocFile = !isSimpleMode && Boolean(docFile);
  const showSimpleFile = isSimpleMode && Boolean(simpleFile);
  const showExisting = isSimpleMode && !simpleFile && Boolean(existingUrl);
  const showDropzone = !(showDocFile || showSimpleFile || showExisting);

  return (
    <div className="mb-2" data-field={field}>
      {label && (
        <label className="mb-3 block text-sm font-semibold text-slate-900">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}

      {showDropzone && isSimpleMode && (
        <div className="flex flex-col items-center gap-2">
          <label className="group relative cursor-pointer">
            <div className="flex size-24 items-center justify-center rounded-full border-2 border-dashed border-slate-300 bg-slate-50 transition-all duration-200 group-hover:border-brand-400 group-hover:bg-brand-50">
              <div className="flex flex-col items-center gap-1">
                <Camera className="size-6 text-slate-400 transition-colors group-hover:text-brand-500" />
                <span className="text-[10px] font-medium text-slate-400 transition-colors group-hover:text-brand-500">
                  Upload
                </span>
              </div>
            </div>
            <input
              type="file"
              multiple={multiple}
              accept={resolvedAccept}
              className="hidden"
              onChange={handleSimpleUpload}
            />
          </label>
          <p className="text-xs text-slate-500">Click to upload {uploadNoun}</p>
          <p className="text-[10px] text-slate-400">
            {resolvedLabel} accepted (max 10MB)
          </p>
        </div>
      )}

      {showDropzone && !isSimpleMode && (
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition-all duration-300 hover:border-brand-400 hover:bg-brand-50">
          <Upload className="mb-3 size-8 text-slate-400" />
          <p className="text-sm text-slate-600">
            Drag & drop or{' '}
            <span className="font-semibold text-brand-600 underline">
              browse
            </span>
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {resolvedLabel} accepted
          </p>
          <input
            type="file"
            multiple={multiple}
            accept={resolvedAccept}
            className="hidden"
            onChange={handleDocUpload}
          />
        </label>
      )}

      {showExisting && (
        <div className="flex flex-col items-center gap-2">
          <div className="group relative">
            {imgError ? (
              <label className="flex size-24 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-brand-400 bg-gradient-to-br from-brand-600 to-brand-800 shadow-sm">
                <Camera className="size-5 text-white" />
                <span className="mt-0.5 text-[10px] font-medium text-white">
                  Upload
                </span>
                <input
                  type="file"
                  accept={resolvedAccept}
                  className="hidden"
                  onChange={handleSimpleUpload}
                />
              </label>
            ) : (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element -- object/blob & remote URLs, next/image needs static-size config we don't have here */}
                <img
                  src={existingUrl ?? undefined}
                  alt="Current logo"
                  className="size-24 rounded-full object-cover shadow-md ring-2 ring-brand-500 ring-offset-2"
                  onError={() => setImgError(true)}
                />
                <label className="bg-black/50 absolute inset-0 flex cursor-pointer flex-col items-center justify-center rounded-full opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <Camera className="size-5 text-white" />
                  <span className="mt-0.5 text-[10px] font-medium text-white">
                    Replace
                  </span>
                  <input
                    type="file"
                    accept={resolvedAccept}
                    className="hidden"
                    onChange={handleSimpleUpload}
                  />
                </label>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={handleExistingRemove}
            className="flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-100"
          >
            <Trash2 className="size-3" />
            Remove
          </button>
        </div>
      )}

      {showSimpleFile && simpleFile && (
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <div
              className={`flex size-24 overflow-hidden rounded-full shadow-md ring-2 ring-offset-2 ${simpleUploading ? 'ring-brand-400' : 'ring-green-400'}`}
            >
              {simpleFile.type?.startsWith('image/') ? (
                // eslint-disable-next-line @next/next/no-img-element -- blob: preview URL, not a static asset
                <img
                  src={previewUrl ?? undefined}
                  alt="Logo preview"
                  className="size-full object-cover"
                />
              ) : (
                <div
                  className={`flex size-full items-center justify-center ${simpleUploading ? 'bg-brand-50' : 'bg-green-50'}`}
                >
                  <FileCheck
                    className={`size-6 ${simpleUploading ? 'text-brand-500' : 'text-green-500'}`}
                  />
                </div>
              )}
            </div>
            {simpleUploading && (
              <div className="bg-black/30 absolute inset-0 flex items-center justify-center rounded-full">
                <span className="text-xs font-bold text-white">
                  {simpleProgress}%
                </span>
              </div>
            )}
          </div>

          <p className="max-w-[140px] truncate text-center text-xs font-medium text-slate-700">
            {simpleFile.name}
          </p>
          <p className="text-[10px] text-slate-400">
            {simpleUploading
              ? `Uploading… ${simpleProgress}%`
              : `${(simpleFile.size / 1024).toFixed(1)} KB`}
          </p>

          {simpleUploading && (
            <div className="h-1 w-24 rounded-full bg-brand-100">
              <div
                className="h-full rounded-full bg-brand-500 transition-all duration-300"
                style={{ width: `${simpleProgress}%` }}
              />
            </div>
          )}

          <button
            type="button"
            onClick={handleSimpleRemove}
            disabled={simpleUploading}
            className="flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-50"
          >
            <Trash2 className="size-3" />
            Remove
          </button>
        </div>
      )}

      {showDocFile && docFile && (
        <div
          className={`mt-4 rounded-full border p-4 transition ${docFile.file_key ? 'border-slate-200 bg-white' : 'border-red-400 bg-red-50'}`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 truncate">
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-full ${docFile.file_key ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
              >
                <FileCheck className="size-5" />
              </div>
              <div className="min-w-0">
                <p
                  className={`truncate text-sm font-semibold ${docFile.file_key ? 'text-slate-900' : 'text-red-700'}`}
                >
                  {docFile.name}
                </p>
                <p
                  className={`text-xs ${docFile.file_key ? 'text-slate-400' : 'text-red-500'}`}
                >
                  {docFile.size}
                </p>
              </div>
            </div>
            {docFile.file_key && (
              <button
                type="button"
                onClick={handleDocRemove}
                className="flex shrink-0 items-center gap-2 rounded-full border border-red-600 bg-red-100 px-4 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-200"
              >
                <Trash2 className="size-3" />
                Remove
              </button>
            )}
          </div>
          {docFile.uploading && (
            <div
              className={`mt-4 h-1.5 w-full rounded-full ${docFile.file_key ? 'bg-green-200' : 'bg-red-200'}`}
            >
              <div
                className={`h-full rounded-full transition-all duration-300 ${docFile.file_key ? 'bg-green-600' : 'bg-red-600'}`}
                style={{ width: `${docFile.progress || 0}%` }}
              />
            </div>
          )}
        </div>
      )}

      {fileError && (
        <div className="mt-2 flex items-start gap-2 rounded-full border border-red-200 bg-red-50 p-2">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-600" />
          <p className="text-xs font-medium text-red-700">{fileError}</p>
        </div>
      )}

      {errors?.[field] && (
        <p className="mt-2 text-xs font-medium text-red-600">{errors[field]}</p>
      )}
    </div>
  );
};

export { ImageUploadField };
