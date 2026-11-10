'use client';

import { type FormEvent, useState } from 'react';

import { StatusFileUpload } from '../../../form/upload/StatusFileUpload';
import { AlertBanner } from '../../../ui/AlertBanner';
import { FormActions } from '../../../ui/buttons/FormActions';
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

/** Verify & Reimburse, with a required proof upload — one file for
 * the whole batch, not per record (same "one proof for the batch"
 * shape as the driver's own RouteDropOffView). The API refuses a
 * reimbursement without it. */
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
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [apiError, setApiError] = useState('');

  const handleClose = () => {
    if (submitting || uploading) return;
    setProofKey('');
    setProofFile(null);
    setApiError('');
    onClose();
  };

  const handleProofChange = async (file: File | undefined) => {
    if (!file) return;
    setProofFile(file);
    setProofKey('');
    setApiError('');
    try {
      const result = await upload(file);
      setProofKey(result.file_key);
    } catch {
      setApiError('Could not upload the proof. Please try again.');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError('');
    if (submitting || uploading) return;
    if (!proofKey) {
      setApiError('Upload the proof of payment before reimbursing.');
      return;
    }
    try {
      await verifyReimburse(ids, proofKey);
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
        <FormActions>
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting || uploading}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="reimburse-form"
            disabled={submitting || uploading}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Saving…' : 'Verify & Reimburse'}
          </button>
        </FormActions>
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
          <StatusFileUpload
            id="reimburse-proof-input"
            label="Reimbursement proof"
            description={
              count === 1
                ? 'A receipt showing the driver was paid back.'
                : `One receipt for all ${count} records.`
            }
            file={proofFile}
            onFileChange={handleProofChange}
            onRemove={() => {
              if (submitting || uploading) return;
              setProofFile(null);
              setProofKey('');
              setApiError('');
            }}
            onError={setApiError}
            required
            disabled={submitting || uploading}
            uploading={uploading}
          />
        </div>
      </form>
    </Modal>
  );
};

export { ReimburseModal };
