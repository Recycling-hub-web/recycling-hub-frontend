'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { LuArrowLeft, LuReceipt, LuTruck, LuUpload } from 'react-icons/lu';

import { InputField } from '../../../form/fields/InputField';
import { SelectField } from '../../../form/fields/SelectField';
import { PageContainer } from '../../../layout/PageContainer';
import { AlertBanner } from '../../../ui/AlertBanner';
import { Button } from '../../../ui/buttons/Button';
import { FormActions } from '../../../ui/buttons/FormActions';
import { Card } from '../../../ui/card/Card';
import { Loading } from '../../../ui/loading/Loading';
import { PageHeader } from '../../../ui/PageHeader';
import { useUploadStorageFile } from '../../storageFiles/hooks';
import { TOOL_RECEIPT_THRESHOLD } from '../constants';
import { useCreateClaim, useMyVehicle } from '../hooks';
import type { ClaimCategory } from '../types';

const CATEGORY_OPTIONS = [
  { value: 'petrol', label: 'Petrol' },
  { value: 'tool', label: 'Tool' },
];

const today = () => new Date().toISOString().slice(0, 10);

type FormState = {
  category: ClaimCategory | '';
  date: string;
  amount_claimed: string;
};

const INITIAL_STATE: FormState = {
  category: '',
  date: today(),
  amount_claimed: '',
};

type ClaimFormProps = {
  basePath: '/driver/claims';
};

const isValidNumber = (value: string): boolean => {
  const n = Number(value);
  return value.trim() !== '' && Number.isFinite(n) && n > 0;
};

/** Driver-facing create form — the only Claims create surface (staff is
 * read-only, accounting/admin only review). `category` first; for
 * petrol, the driver's own assigned vehicle is resolved automatically
 * (useMyVehicle) rather than picked — there's no vehicle picker
 * anymore, every driver has at most one vehicle. */
const ClaimForm = ({ basePath }: ClaimFormProps) => {
  const router = useRouter();
  const {
    execute: createClaim,
    loading: submitting,
    error: apiError,
  } = useCreateClaim();
  const {
    vehicle,
    loading: loadingVehicle,
    error: vehicleError,
    hasNoVehicle,
  } = useMyVehicle();
  const {
    execute: upload,
    loading: uploading,
    error: uploadError,
  } = useUploadStorageFile();

  const [formData, setFormData] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [receiptKey, setReceiptKey] = useState('');
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const isPetrol = formData.category === 'petrol';
  const isFleetCard =
    isPetrol && vehicle?.ownership === 'company' && vehicle.has_fleet_card;
  const isPetrolBlocked = isPetrol && (hasNoVehicle || Boolean(isFleetCard));

  const amount = Number(formData.amount_claimed);
  const receiptSuggested =
    Number.isFinite(amount) && amount >= TOOL_RECEIPT_THRESHOLD;

  const handleReceiptChange = async (file: File | undefined) => {
    if (!file) return;
    try {
      const result = await upload(file);
      setReceiptKey(result.file_key);
      setReceiptPreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, receipt: '' }));
    } catch {
      // useUploadStorageFile already captured the message in uploadError.
    }
  };

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};

    if (!formData.category) {
      nextErrors.category = 'Category is required.';
    } else if (!isPetrolBlocked) {
      if (!isValidNumber(formData.amount_claimed)) {
        nextErrors.amount_claimed = 'Enter a valid amount.';
      }
    }

    if (!formData.date) nextErrors.date = 'Date is required.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isPetrolBlocked) return;
    if (!validate()) return;

    const payload = {
      category: formData.category as ClaimCategory,
      date: formData.date,
      amount_claimed: Number(formData.amount_claimed),
      receipt: receiptKey || undefined,
    };

    try {
      const claim = await createClaim(payload);
      router.push(`${basePath}/${claim.id}`);
    } catch {
      // useCreateClaim already captured the message in apiError.
    }
  };

  let receiptUploadLabel = 'Upload receipt';
  if (uploading) receiptUploadLabel = 'Uploading…';
  else if (receiptKey) receiptUploadLabel = 'Replace receipt';

  const renderReceiptUploader = (required: boolean) => (
    <div className="mb-4" data-field="receipt">
      <label className="block text-sm font-medium text-slate-900">
        Receipt {required && <span className="text-red-600">*</span>}
      </label>
      <div className="mt-2 flex items-center gap-4">
        {receiptPreview ? (
          // eslint-disable-next-line @next/next/no-img-element -- local object URL preview, not a static asset
          <img
            src={receiptPreview}
            alt=""
            className="size-16 shrink-0 rounded-xl border border-slate-200 object-cover"
          />
        ) : (
          <span className="flex size-16 shrink-0 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-slate-400">
            <LuReceipt className="size-6" />
          </span>
        )}
        <label
          htmlFor="claim-receipt-input"
          className={`flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-300 hover:bg-slate-50 ${
            uploading || submitting ? 'pointer-events-none opacity-50' : ''
          }`}
        >
          <LuUpload className="size-4" />
          {receiptUploadLabel}
        </label>
      </div>
      <input
        id="claim-receipt-input"
        type="file"
        accept="image/*"
        className="sr-only"
        disabled={uploading || submitting}
        onChange={(e) => handleReceiptChange(e.target.files?.[0])}
      />
      {errors.receipt && (
        <p className="mt-1 text-xs text-red-600">{errors.receipt}</p>
      )}
    </div>
  );

  return (
    <PageContainer variant="form">
      <Link
        href={basePath}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <LuArrowLeft className="size-4" />
        Back to expense claims
      </Link>

      <PageHeader
        title="New expense claim"
        subtitle="Submit a petrol or tool reimbursement claim for review."
      />

      <Card className="p-5">
        <form onSubmit={handleSubmit}>
          <AlertBanner message={apiError || uploadError || vehicleError} />

          <div className="grid gap-x-4 sm:grid-cols-2">
            <SelectField
              label="Category"
              field="category"
              options={CATEGORY_OPTIONS}
              formData={formData}
              errors={errors}
              updateFormData={(_field, value) => {
                setFormData({
                  ...INITIAL_STATE,
                  date: formData.date,
                  category: value as ClaimCategory,
                });
                setErrors({});
                setReceiptKey('');
                setReceiptPreview(null);
              }}
              disabled={submitting}
            />
            <InputField
              label="Date"
              field="date"
              type="date"
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />

            {isPetrol && loadingVehicle && (
              <div className="sm:col-span-2">
                <Loading text="Checking your assigned vehicle…" />
              </div>
            )}

            {isPetrol && !loadingVehicle && hasNoVehicle && (
              <div className="sm:col-span-2">
                <AlertBanner
                  variant="warning"
                  message="No vehicle is assigned to you — contact an admin before submitting a petrol claim."
                />
              </div>
            )}

            {isPetrol && !loadingVehicle && !hasNoVehicle && isFleetCard && (
              <div className="sm:col-span-2">
                <AlertBanner
                  variant="warning"
                  message="Fleet card vehicles are reimbursed directly — no claim needed."
                />
              </div>
            )}

            {isPetrol &&
              !loadingVehicle &&
              !hasNoVehicle &&
              !isFleetCard &&
              vehicle && (
                <div className="mb-4 flex items-center gap-1.5 text-xs text-slate-400 sm:col-span-2">
                  <LuTruck className="size-3.5" />
                  Your vehicle: {vehicle.plate_number}
                </div>
              )}

            {((isPetrol && !loadingVehicle && !isPetrolBlocked) ||
              formData.category === 'tool') && (
              <>
                <InputField
                  label="Amount claimed"
                  field="amount_claimed"
                  type="number"
                  prefix="RM"
                  placeholder="0.00"
                  formData={formData}
                  errors={errors}
                  updateFormData={updateFormData}
                  disabled={submitting}
                />
                <div className="sm:col-span-2">
                  {renderReceiptUploader(receiptSuggested)}
                  <p className="-mt-3 mb-4 text-xs text-slate-400">
                    A receipt is required for claims of RM
                    {TOOL_RECEIPT_THRESHOLD} or more.
                  </p>
                </div>
              </>
            )}
          </div>

          <FormActions className="pt-5">
            <Button href={basePath} variant="secondary">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                submitting || (isPetrol && (loadingVehicle || isPetrolBlocked))
              }
            >
              {submitting ? 'Submitting…' : 'Submit claim'}
            </Button>
          </FormActions>
        </form>
      </Card>
    </PageContainer>
  );
};

export { ClaimForm };
