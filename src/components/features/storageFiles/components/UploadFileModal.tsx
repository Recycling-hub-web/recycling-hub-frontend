'use client';

import { type FormEvent, useState } from 'react';
import { LuUpload } from 'react-icons/lu';

import { AlertBanner } from '../../../ui/AlertBanner';
import { Modal } from '../../../ui/modal/Modal';
import { formatFileSize } from '../constants';
import { useUploadStorageFile } from '../hooks';

type UploadFileModalProps = {
  open: boolean;
  onClose: () => void;
  onUploaded: () => void;
};

/** Two real HTTP steps behind one button: ask our API for a presigned
 * POST target (apps.storage.views.PresignedUploadUrlView), then upload
 * the bytes straight to storage with it — see
 * services/storageFileService.ts. Modal, not a full create page, since
 * there's no metadata form here, just a file picker. */
const UploadFileModal = ({
  open,
  onClose,
  onUploaded,
}: UploadFileModalProps) => {
  const { execute: upload, loading: submitting } = useUploadStorageFile();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const handleClose = () => {
    setFile(null);
    setError('');
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    // Only ever disabled while in flight — validate on submit instead of
    // gating the button on whether a file has been picked yet.
    if (!file) {
      setError('Choose a file to upload.');
      return;
    }
    try {
      await upload(file);
      onUploaded();
      handleClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not upload the file.',
      );
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Upload file"
      subtitle="Uploads directly to storage via a presigned URL."
      footer={
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="upload-file-form"
            disabled={submitting}
            className="flex-1 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Uploading…' : 'Upload'}
          </button>
        </div>
      }
    >
      <form id="upload-file-form" onSubmit={handleSubmit} noValidate>
        <AlertBanner message={error} />

        <label
          htmlFor="storage-file-input"
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 px-4 py-8 text-center transition hover:border-brand-300 hover:bg-slate-50"
        >
          <LuUpload className="size-6 text-slate-400" />
          {file ? (
            <span className="text-sm font-medium text-slate-700">
              {file.name}{' '}
              <span className="text-slate-400">
                ({formatFileSize(file.size)})
              </span>
            </span>
          ) : (
            <span className="text-sm text-slate-500">
              Click to choose a file
            </span>
          )}
        </label>
        <input
          id="storage-file-input"
          type="file"
          className="sr-only"
          disabled={submitting}
          onChange={(e) => {
            setFile(e.target.files?.[0] ?? null);
            setError('');
          }}
        />
      </form>
    </Modal>
  );
};

export { UploadFileModal };
