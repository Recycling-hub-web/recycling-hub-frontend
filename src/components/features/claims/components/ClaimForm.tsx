'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { LuArrowLeft, LuTruck } from 'react-icons/lu';

import { usePortalLocale } from '../../../../contexts/PortalLocaleContext';
import { InputField } from '../../../form/fields/InputField';
import { SelectField } from '../../../form/fields/SelectField';
import { StatusFileUpload } from '../../../form/upload/StatusFileUpload';
import { ValidatedForm } from '../../../form/ValidatedForm';
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
  const { t } = usePortalLocale();
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
    retry: retryVehicle,
  } = useMyVehicle();
  const { execute: upload, loading: uploading } = useUploadStorageFile();

  const [formData, setFormData] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [receiptKey, setReceiptKey] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptError, setReceiptError] = useState('');
  const translatedErrors = Object.fromEntries(
    Object.entries(errors).map(([key, value]) => [key, t(value)]),
  );

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const isPetrol = formData.category === 'petrol';
  const isFleetCard =
    isPetrol && vehicle?.ownership === 'company' && vehicle.has_fleet_card;
  const isPetrolBlocked =
    isPetrol && (hasNoVehicle || Boolean(vehicleError) || Boolean(isFleetCard));

  const amount = Number(formData.amount_claimed);
  const receiptSuggested =
    Number.isFinite(amount) && amount >= TOOL_RECEIPT_THRESHOLD;

  const handleReceiptChange = async (file: File | undefined) => {
    if (!file) return;
    setReceiptKey('');
    setReceiptFile(file);
    setReceiptError('');
    try {
      const result = await upload(file);
      setReceiptKey(result.file_key);
      setErrors((prev) => ({ ...prev, receipt: '' }));
    } catch (err) {
      setReceiptError(
        err instanceof Error ? err.message : 'Could not upload the file.',
      );
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

    if (receiptSuggested && !receiptKey)
      nextErrors.receipt = 'Upload a receipt for claims of RM50 or more.';
    else if (receiptFile && !receiptKey)
      nextErrors.receipt =
        'Upload the receipt successfully or remove it before submitting.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting || uploading || isPetrolBlocked) return;
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

  return (
    <PageContainer variant="form">
      <Link
        href={basePath}
        className="mb-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-700 lg:mb-4 lg:min-h-0"
      >
        <LuArrowLeft className="size-4" />
        {t('Back to expense claims')}
      </Link>

      <PageHeader
        title={t('New expense claim')}
        subtitle={t('Submit a petrol or tool reimbursement claim for review.')}
      />

      <Card className="p-5">
        <ValidatedForm onSubmit={handleSubmit} fieldErrors={translatedErrors}>
          <AlertBanner
            message={t(
              apiError || receiptError || (isPetrol ? vehicleError : ''),
            )}
          />

          {isPetrol && vehicleError && (
            <button
              type="button"
              onClick={retryVehicle}
              className="mb-4 min-h-11 rounded-lg px-3 text-sm font-semibold text-brand-800 underline"
            >
              {t('Retry')}
            </button>
          )}
          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <SelectField
              label={t('Category')}
              field="category"
              options={CATEGORY_OPTIONS.map((option) => ({
                ...option,
                label: t(option.label),
              }))}
              formData={formData}
              errors={translatedErrors}
              updateFormData={(_field, value) => {
                setFormData({
                  ...INITIAL_STATE,
                  date: formData.date,
                  category: value as ClaimCategory,
                });
                setErrors({});
                setReceiptKey('');
                setReceiptFile(null);
                setReceiptError('');
              }}
              disabled={submitting || uploading}
            />
            <InputField
              label={t('Date')}
              field="date"
              type="date"
              formData={formData}
              errors={translatedErrors}
              updateFormData={updateFormData}
              disabled={submitting || uploading}
            />

            {isPetrol && loadingVehicle && (
              <div className="sm:col-span-2">
                <Loading text={t('Checking your assigned vehicle…')} />
              </div>
            )}

            {isPetrol && !loadingVehicle && hasNoVehicle && (
              <div className="sm:col-span-2">
                <AlertBanner
                  variant="warning"
                  message={t(
                    'No vehicle is assigned to you — contact an admin before submitting a petrol claim.',
                  )}
                />
              </div>
            )}

            {isPetrol && !loadingVehicle && !hasNoVehicle && isFleetCard && (
              <div className="sm:col-span-2">
                <AlertBanner
                  variant="warning"
                  message={t(
                    'Fleet card vehicles are reimbursed directly — no claim needed.',
                  )}
                />
              </div>
            )}

            {isPetrol &&
              !loadingVehicle &&
              !hasNoVehicle &&
              !isFleetCard &&
              vehicle && (
                <div className="mb-4 flex items-center gap-1.5 text-xs text-slate-600 sm:col-span-2">
                  <LuTruck className="size-3.5" />
                  {t('Your vehicle:')} {vehicle.plate_number}
                </div>
              )}

            {((isPetrol && !loadingVehicle && !isPetrolBlocked) ||
              formData.category === 'tool') && (
              <>
                <InputField
                  label={t('Amount claimed')}
                  field="amount_claimed"
                  type="number"
                  prefix="RM"
                  placeholder={t('0.00')}
                  formData={formData}
                  errors={translatedErrors}
                  updateFormData={updateFormData}
                  disabled={submitting || uploading}
                />
                <div className="sm:col-span-2" data-field="receipt">
                  <StatusFileUpload
                    id="claim-receipt-input"
                    label={t('Receipt')}
                    error={translatedErrors.receipt}
                    file={receiptFile}
                    onFileChange={handleReceiptChange}
                    onRemove={() => {
                      setReceiptFile(null);
                      setReceiptKey('');
                      setReceiptError('');
                      setErrors((previous) => ({ ...previous, receipt: '' }));
                    }}
                    onError={setReceiptError}
                    disabled={submitting || uploading}
                    uploading={uploading}
                    required={receiptSuggested}
                  />
                  <p className="mb-4 mt-2 text-xs text-slate-600">
                    {t(
                      'A receipt is required for claims of RM{threshold} or more.',
                      { threshold: TOOL_RECEIPT_THRESHOLD },
                    )}
                  </p>
                </div>
              </>
            )}
          </div>

          <FormActions className="pt-5">
            <Button href={basePath} variant="secondary">
              {t('Cancel')}
            </Button>
            <Button
              type="submit"
              disabled={
                submitting ||
                uploading ||
                (isPetrol && (loadingVehicle || isPetrolBlocked))
              }
            >
              {submitting ? t('Submitting…') : t('Submit claim')}
            </Button>
          </FormActions>
        </ValidatedForm>
      </Card>
    </PageContainer>
  );
};

export { ClaimForm };
