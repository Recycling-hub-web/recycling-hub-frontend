'use client';

import { type FormEvent, useState } from 'react';

import { InputField } from '../../../form/fields/InputField';
import { TextareaField } from '../../../form/fields/TextareaField';
import { AlertBanner } from '../../../ui/AlertBanner';
import { FormActions } from '../../../ui/buttons/FormActions';
import { Modal } from '../../../ui/modal/Modal';
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

/** Accounting/admin's Approve (optional amount override — omit to
 * approve at the claimed amount) and Reject (rejection reason
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

  const submitting = approving || rejecting;
  let submitButtonLabel = mode === 'approve' ? 'Approve' : 'Reject';
  if (submitting) submitButtonLabel = 'Saving…';

  const handleClose = () => {
    setAmountApproved('');
    setRejectionReason('');
    setError('');
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'approve') {
        await approve(
          claim.id,
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
    } catch {
      setError(
        mode === 'approve'
          ? 'Could not approve this claim. Please try again.'
          : 'Could not reject this claim. Please try again.',
      );
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={mode === 'approve' ? 'Approve claim' : 'Reject claim'}
      subtitle={
        mode === 'approve'
          ? 'Optionally override the amount approved for payout.'
          : 'A reason is required so the driver knows why.'
      }
      footer={
        <FormActions>
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="approve-reject-form"
            disabled={submitting}
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
              placeholder={`Default: ${claim.amount_claimed}`}
              formData={{ amount_approved: amountApproved }}
              updateFormData={(_field, value) => setAmountApproved(value)}
              disabled={submitting}
            />
            <p className="-mt-3 mb-4 text-xs text-slate-400">
              Leave blank to approve at the claimed amount (RM
              {claim.amount_claimed}).
            </p>
          </>
        ) : (
          <TextareaField
            label="Rejection reason"
            field="rejection_reason"
            placeholder="Why this claim is being rejected"
            formData={{ rejection_reason: rejectionReason }}
            updateFormData={(_field, value) => setRejectionReason(value)}
            disabled={submitting}
          />
        )}
      </form>
    </Modal>
  );
};

export { ApproveRejectModal };
