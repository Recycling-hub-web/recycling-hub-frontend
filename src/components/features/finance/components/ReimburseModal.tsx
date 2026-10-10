'use client';

import { type FormEvent, useState } from 'react';
import { LuReceipt, LuUpload } from 'react-icons/lu';

import { AlertBanner } from '../../../ui/AlertBanner';
import { Modal } from '../../../ui/modal/Modal';
import { useUploadStorageFile } from '../../storageFiles/hooks';
import { useVerifyReimburse } from '../hooks';

type ReimburseModalProps = {
  /** One or many — the same action either way (see
   * FinanceRecordViewSet.verify_reimburse). */
  ids: string[];
  open: boolean;
  onClose: () => void;
  onReimbursed: () => void;
};

/** Verify & Reimburse, with an optional proof upload — one file for
 * the whole batch, not per record (same "one proof for the batch"
 * shape as the driver's own RouteDropOffView). Proof stays optional
 * here, same as CollectModal's own proof_of_payment — not required
 * client- or server-side. */
const ReimburseModal = ({
  ids,
  open,
  onClose,
  onReimbursed,
}: ReimburseModalProps) => {
  const { execute: verifyReimburse, loading: submitting } =
    useVerifyReimburse();
  const { execute: upload, loading: uploading } = useUploadStorageFile();
  const [proofKey, setProofKey] = useState('');
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [apiError, setApiError] = useState('');

  let uploadLabel = 'Upload';
  if (uploading) uploadLabel = 'Uploading…';
  else if (proofKey) uploadLabel = 'Replace';

  const handleClose = () => {
    setProofKey('');
    setProofPreview(null);
    setApiError('');
    onClose();
  };

  const handleProofChange = async (file: File | undefined) => {
    if (!file) return;
    try {
      const result = await upload(file);
      setProofKey(result.file_key);
      setProofPreview(URL.createObjectURL(file));
    } catch {
      setApiError('Could not upload the proof. Please try again.');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError('');
    try {
      await verifyReimburse(ids, proofKey || undefined);
      onReimbursed();
      handleClose();
    } catch {
      setApiError('Could not verify and reimburse this. Please try again.');
    }
  };

  const count = ids.length;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Verify & Reimburse"
      subtitle={
        count === 1
          ? 'Confirm this driver has been paid back.'
          : `Confirm these ${count} drivers' records have been paid back.`
      }
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
            form="reimburse-form"
            disabled={submitting || uploading}
            className="flex-1 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Saving…' : 'Verify & Reimburse'}
          </button>
        </div>
      }
    >
      <form
        id="reimburse-form"
        onSubmit={handleSubmit}
        noValidate
        className="space-y-1"
      >
        <AlertBanner message={apiError} />

        <div className="mb-4" data-field="reimbursement_proof">
          <label className="block text-sm font-medium text-slate-900">
            Reimbursement proof
          </label>
          <p className="mt-0.5 text-xs text-slate-500">
            {count === 1
              ? 'Optional — a bank transfer receipt proving the driver was paid back.'
              : `Optional — one receipt for all ${count} records, not one per record.`}
          </p>
          <div className="mt-2 flex items-center gap-4">
            {proofPreview ? (
              // eslint-disable-next-line @next/next/no-img-element -- local object URL preview, not a static asset
              <img
                src={proofPreview}
                alt=""
                className="size-16 shrink-0 rounded-xl border border-slate-200 object-cover"
              />
            ) : (
              <span className="flex size-16 shrink-0 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-slate-400">
                <LuReceipt className="size-6" />
              </span>
            )}
            <label
              htmlFor="reimburse-proof-input"
              className={`flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-300 hover:bg-slate-50 ${
                uploading ? 'pointer-events-none opacity-50' : ''
              }`}
            >
              <LuUpload className="size-4" />
              {uploadLabel}
            </label>
          </div>
          <input
            id="reimburse-proof-input"
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={uploading}
            onChange={(e) => handleProofChange(e.target.files?.[0])}
          />
        </div>
      </form>
    </Modal>
  );
};

export { ReimburseModal };
