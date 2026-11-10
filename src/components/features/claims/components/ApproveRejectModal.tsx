'use client';

import { type FormEvent, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { InputField } from '../../../form/fields/InputField';
import { TextareaField } from '../../../form/fields/TextareaField';
import { StatusFileUpload } from '../../../form/upload/StatusFileUpload';
import { AlertBanner } from '../../../ui/AlertBanner';
import { FormActions } from '../../../ui/buttons/FormActions';
import { Modal } from '../../../ui/modal/Modal';
import { useUploadStorageFile } from '../../storageFiles/hooks';
import { useApproveClaim, useRejectClaim } from '../hooks';
import type { ClaimListItem } from '../types';

type ApproveRejectModalProps = {
  claim: ClaimListItem;
  /** Which action this instance performs — the two share a lot of modal
   * chrome but need different fields/validation, so one component
   * with a mode switch beats two near-duplicate modals. */
  mode: 'approve' | 'reject';
  open: boolean;
  onClose: () => void;
  onDone: () => void;
};

/** Accounting/admin's combined approval/payment (proof required)
 * and Reject (rejection reason
 * required) actions, both opened from ClaimDetailsView's
 * ActionsDropdown. */
const ApproveRejectModal = ({
  claim,
  mode,
  open,
  onClose,
  onDone,
}: ApproveRejectModalProps) => {
  const { execute: approve, loading: approving } = useApproveClaim();
  const { execute: reject, loading: rejecting } = useRejectClaim();
  const [amountApproved, setAmountApproved] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [error, setError] = useState('');
  const [paymentProof, setPaymentProof] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const { execute: upload, loading: uploading } = useUploadStorageFile();

  const handleProofChange = async (file: File | undefined) => {
    if (!file) return;
    setError('');
    setPaymentProof('');
    setProofFile(file);
    try {
      const result = await upload(file);
      setPaymentProof(result.file_key);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not upload payment proof.',
      );
    }
  };

  const submitting = approving || rejecting;
  let submitButtonLabel =
    mode === 'approve' ? 'Approve & mark as paid' : 'Reject';
  if (submitting) submitButtonLabel = 'Saving…';

  const handleClose = () => {
    if (submitting || uploading) return;
    setPaymentProof('');
    setProofFile(null);
    setAmountApproved('');
    setRejectionReason('');
    setError('');
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (submitting || uploading) return;
    try {
      if (mode === 'approve') {
        if (!paymentProof) {
          setError(
            'Upload payment proof before approving and marking this claim as paid.',
          );
          return;
        }
        await approve(
          claim.id,
          paymentProof,
          amountApproved.trim() ? Number(amountApproved) : undefined,
        );
      } else {
        if (!rejectionReason.trim()) {
          setError('A rejection reason is required.');
          return;
        }
        await reject(claim.id, rejectionReason);
      }
      onDone();
      handleClose();
    } catch (err) {
      const fallback =
        mode === 'approve'
          ? 'Could not approve and pay this claim. Please try again.'
          : 'Could not reject this claim. Please try again.';
      setError(err instanceof ApiError ? err.message : fallback);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={mode === 'approve' ? 'Approve & mark as paid' : 'Reject claim'}
      subtitle={
        mode === 'approve'
          ? 'Confirm payment with proof. Approval and payment are saved together.'
          : 'A reason is required so the driver knows why.'
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
            form="approve-reject-form"
            disabled={submitting || uploading}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitButtonLabel}
          </button>
        </FormActions>
      }
    >
      <form
        id="approve-reject-form"
        onSubmit={handleSubmit}
        noValidate
        className="space-y-1"
      >
        <AlertBanner message={error} />

        {mode === 'approve' ? (
          <>
            <InputField
              label="Amount approved"
              field="amount_approved"
              type="number"
              prefix="RM"
              required={false}
              placeholder={`Default: ${claim.amount_approved ?? claim.amount_claimed}`}
              formData={{ amount_approved: amountApproved }}
              updateFormData={(_field, value) => setAmountApproved(value)}
              disabled={submitting || uploading}
            />
            <p className="-mt-3 mb-4 text-xs text-slate-400">
              Leave blank to use RM
              {claim.amount_approved ?? claim.amount_claimed}.
            </p>
            <div className="mb-4" data-field="payment_proof">
              <StatusFileUpload
                id="claim-payment-proof-input"
                label="Payment proof"
                description="Upload a receipt showing the driver was paid."
                file={proofFile}
                onFileChange={handleProofChange}
                onRemove={() => {
                  if (submitting || uploading) return;
                  setProofFile(null);
                  setPaymentProof('');
                  setError('');
                }}
                onError={setError}
                required
                disabled={submitting || uploading}
                uploading={uploading}
              />
            </div>
          </>
        ) : (
          <TextareaField
            label="Rejection reason"
            field="rejection_reason"
            placeholder="Why this claim is being rejected"
            formData={{ rejection_reason: rejectionReason }}
            updateFormData={(_field, value) => setRejectionReason(value)}
            disabled={submitting || uploading}
          />
        )}
      </form>
    </Modal>
  );
};

export { ApproveRejectModal };
