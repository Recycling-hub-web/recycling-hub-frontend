'use client';

import { type FormEvent, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { StatusFileUpload } from '../../../form/upload/StatusFileUpload';
import { ValidatedForm } from '../../../form/ValidatedForm';
import { AlertBanner } from '../../../ui/AlertBanner';
import { Button } from '../../../ui/buttons/Button';
import { FormActions } from '../../../ui/buttons/FormActions';
import { AppDate } from '../../../ui/date/AppDate';
import { Modal } from '../../../ui/modal/Modal';
import { useUploadStorageFile } from '../../storageFiles/hooks';
import { claimPaymentTotal } from '../payment';
import { bulkPayClaims } from '../services/claimsService';
import { CLAIM_CATEGORY_LABELS, type ClaimListItem } from '../types';

type Props = {
  claims: ClaimListItem[];
  onClose: () => void;
  onPaid: () => void;
};

const BulkPayClaimsModal = ({ claims, onClose, onPaid }: Props) => {
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proof, setProof] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const { execute: upload, loading: uploading } = useUploadStorageFile();
  const busy = saving || uploading;
  const driver = claims[0]?.driver;
  const total = claimPaymentTotal(claims);

  const handleProof = async (file: File) => {
    setError('');
    setProof('');
    setProofFile(file);
    try {
      const result = await upload(file);
      setProof(result.file_key);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not upload payment proof.',
      );
    }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy || !driver) return;
    setError('');
    if (!proof) {
      setError('Upload proof of the combined payment.');
      return;
    }
    setSaving(true);
    try {
      await bulkPayClaims({
        claim_ids: claims.map((claim) => claim.id),
        driver: driver.id,
        total_amount: total,
        payment_proof: proof,
      });
      onPaid();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not record payment. Please try again.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      dismissible={!busy}
      size="lg"
      title="Pay selected expense claims"
      subtitle="Record one cashless payment."
      footer={
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500">Total reimbursement</p>
            <p className="text-xl font-bold tabular-nums text-brand-800">
              RM {total}
            </p>
          </div>
          <FormActions>
            <Button variant="secondary" onClick={onClose} disabled={busy}>
              Cancel
            </Button>
            <Button type="submit" form="bulk-pay-claims-form" disabled={busy}>
              {saving ? 'Saving…' : 'Confirm payment'}
            </Button>
          </FormActions>
        </div>
      }
    >
      <ValidatedForm
        id="bulk-pay-claims-form"
        onSubmit={submit}
        noValidate
        className="space-y-4 py-2"
      >
        <AlertBanner message={error} />
        <div className="rounded-xl bg-brand-50 p-4">
          <p className="text-xs text-slate-500">Paying driver</p>
          <p className="mt-1 font-semibold text-slate-900">
            {driver?.full_name}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {claims.length} pending {claims.length === 1 ? 'claim' : 'claims'}
          </p>
        </div>
        <ul
          aria-label="Selected claims"
          className="divide-y divide-slate-100 rounded-xl border border-slate-200 px-4"
        >
          {claims.map((claim) => (
            <li
              key={claim.id}
              className="flex items-start justify-between gap-4 py-3 text-sm"
            >
              <div>
                <p className="font-medium text-slate-800">
                  {CLAIM_CATEGORY_LABELS[claim.category]}
                  {claim.vehicle ? ` · ${claim.vehicle.plate_number}` : ''}
                </p>
                <AppDate
                  value={claim.date}
                  className="text-xs text-slate-500"
                />
              </div>
              <span className="shrink-0 font-semibold tabular-nums">
                RM {claim.amount_approved ?? claim.amount_claimed}
              </span>
            </li>
          ))}
        </ul>
        <div data-field="bulk_payment_proof">
          <StatusFileUpload
            compact
            id="bulk-claim-proof"
            label="Payment proof"
            description="Upload the receipt for the combined DuitNow or bank transfer. This proof will be saved against every selected claim."
            file={proofFile}
            onFileChange={handleProof}
            onRemove={() => {
              if (!busy) {
                setProofFile(null);
                setProof('');
              }
            }}
            onError={setError}
            disabled={busy}
            uploading={uploading}
            required
          />
        </div>
      </ValidatedForm>
    </Modal>
  );
};

export { BulkPayClaimsModal };
