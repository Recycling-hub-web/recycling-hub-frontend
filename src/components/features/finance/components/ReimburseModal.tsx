'use client';

import { type FormEvent, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { StatusFileUpload } from '../../../form/upload/StatusFileUpload';
import { ValidatedForm } from '../../../form/ValidatedForm';
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
  const [recordErrors, setRecordErrors] = useState<
    { order: string; reason: string }[]
  >([]);

  const handleClose = () => {
    if (submitting || uploading) return;
    setProofKey('');
    setProofFile(null);
    setApiError('');
    setRecordErrors([]);
    onClose();
  };

  const handleProofChange = async (file: File | undefined) => {
    if (!file) return;
    setProofFile(file);
    setProofKey('');
    setApiError('');
    setRecordErrors([]);
    try {
      const result = await upload(file);
      setProofKey(result.file_key);
    } catch (err) {
      setApiError(
        err instanceof ApiError
          ? err.message
          : 'Could not upload the proof. Please try again.',
      );
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError('');
    setRecordErrors([]);
    if (submitting || uploading) return;
    if (!proofKey) {
      setApiError('Upload the proof of payment before reimbursing.');
      return;
    }
    try {
      await verifyReimburse(ids, proofKey);
      onReimbursed();
      handleClose();
    } catch (err) {
      setApiError(
        err instanceof ApiError
          ? err.message
          : 'Could not verify and reimburse this. Please try again.',
      );
      if (
        err instanceof ApiError &&
        err.data &&
        typeof err.data === 'object' &&
        'records' in err.data &&
        Array.isArray(err.data.records)
      ) {
        setRecordErrors(
          err.data.records.flatMap((record: unknown) => {
            if (!record || typeof record !== 'object') return [];
            const item = record as Record<string, unknown>;
            return typeof item.order === 'string' &&
              typeof item.reason === 'string'
              ? [{ order: item.order, reason: item.reason }]
              : [];
          }),
        );
      }
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
          : `Review and record payment for ${count} orders. One proof covers this batch.`
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
      <ValidatedForm
        id="reimburse-form"
        onSubmit={handleSubmit}
        noValidate
        className="space-y-1"
      >
        <AlertBanner message={apiError} />
        {recordErrors.length > 0 && (
          <ul
            className="mb-4 space-y-2 rounded-xl bg-red-50 p-4 text-sm text-red-800"
            aria-label="Records requiring attention"
          >
            {recordErrors.map((record) => (
              <li key={record.order}>
                <strong>{record.order}</strong>: {record.reason}
              </li>
            ))}
          </ul>
        )}

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
              setRecordErrors([]);
            }}
            onError={setApiError}
            required
            disabled={submitting || uploading}
            uploading={uploading}
          />
        </div>
      </ValidatedForm>
    </Modal>
  );
};

export { ReimburseModal };
