'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { LuArrowLeft } from 'react-icons/lu';

import {
  joinPhoneNumber,
  splitPhoneNumber,
} from '../../../../constants/dialCodes';
import { InputField } from '../../../form/fields/InputField';
import { PhoneInputField } from '../../../form/fields/PhoneInputField';
import { SelectField } from '../../../form/fields/SelectField';
import { TextareaField } from '../../../form/fields/TextareaField';
import { PageContainer } from '../../../layout/PageContainer';
import { AlertBanner } from '../../../ui/AlertBanner';
import { Button } from '../../../ui/buttons/Button';
import { Card } from '../../../ui/card/Card';
import { Loading } from '../../../ui/loading/Loading';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
import { REQUEST_TYPE_FILTER_OPTIONS } from '../constants';
import {
  useConvertQuickPickupRequest,
  useCreatePickupRequest,
  useEvaluatePickup,
  usePickupCategories,
  useQuickPickupRequest,
} from '../hooks';
import type { PickupRequestType } from '../types';
import { type Photo, PickupPhotoUploader } from './PickupPhotoUploader';

type FormState = {
  full_name: string;
  email: string;
  // Split for PhoneInputField's own dialCodeField/numberField contract —
  // joined back into the single `phone_number` string the backend
  // actually stores only at submit time (see joinPhoneNumber).
  phone_dial_code: string;
  phone_local: string;
  category: string;
  request_type: PickupRequestType;
  pickup_address: string;
  estimated_quantity: string;
  quantity_unit: string;
  note: string;
  // Optional — evaluating right here skips the separate Evaluate step
  // on the details page afterward. Kept as its own trio of fields
  // rather than reusing EvaluateModal's own state, since this form has
  // a third option (''/"not yet") that modal doesn't need.
  // 'none' rather than '' — SelectField's own built-in disabled
  // placeholder option also uses value="", and an empty-string real
  // option collides with it (same gotcha found building Categories).
  evaluation_decision: 'none' | 'approved' | 'rejected';
  evaluation_price: string;
  evaluation_reason: string;
};

const INITIAL_STATE: FormState = {
  full_name: '',
  email: '',
  phone_dial_code: '+60',
  phone_local: '',
  category: '',
  request_type: 'individual',
  pickup_address: '',
  estimated_quantity: '',
  quantity_unit: '',
  note: '',
  evaluation_decision: 'none',
  evaluation_price: '',
  evaluation_reason: '',
};

// REQUEST_TYPE_FILTER_OPTIONS' own leading "All types" option doesn't
// apply to a create form — every request needs one real type.
const REQUEST_TYPE_OPTIONS = REQUEST_TYPE_FILTER_OPTIONS.filter(
  (opt) => opt.value,
);

const EVALUATE_NOW_OPTIONS = [
  { value: 'none', label: 'Not yet — evaluate later' },
  { value: 'approved', label: 'Approve' },
  { value: 'rejected', label: 'Reject' },
];

type CreatePickupRequestViewProps = {
  basePath: '/admin/pickups' | '/staff/pickups';
};

// Same public POST /pickups/ the real public request form uses (see
// PublicPickupRequestForm) — this just lets admin/staff log a request
// taken over the phone or in person, without requiring the requester to
// use the public form themselves.
const CreatePickupRequestView = ({
  basePath,
}: CreatePickupRequestViewProps) => {
  const router = useRouter();
  const toast = useToast();
  const searchParams = useSearchParams();
  // Present only when reached via QuickLeadTable's "Follow up" action —
  // completes that lead into a real request instead of a plain create.
  const leadId = searchParams?.get('leadId') ?? null;

  const {
    execute: createRequest,
    loading: creating,
    error: createError,
  } = useCreatePickupRequest();
  const {
    execute: convertLead,
    loading: converting,
    error: convertError,
  } = useConvertQuickPickupRequest();
  const { execute: evaluateRequest } = useEvaluatePickup();
  const { lead, loading: loadingLead } = useQuickPickupRequest(leadId);
  const { options: categoryOptions, loading: loadingCategories } =
    usePickupCategories();
  const [formData, setFormData] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoKey, setPhotoKey] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<Photo>(null);

  const submitting = creating || converting;
  const error = createError || convertError;

  // Prefill type + phone once the lead loads — staff can still edit
  // either before submitting.
  useEffect(() => {
    if (!lead) return;
    const { dialCode, number } = splitPhoneNumber(lead.phone_number);
    setFormData((prev) => ({
      ...prev,
      request_type: lead.request_type,
      phone_dial_code: dialCode,
      phone_local: number,
    }));
  }, [lead]);

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = (data: FormState): boolean => {
    const nextErrors: Record<string, string> = {};
    if (!data.full_name.trim()) nextErrors.full_name = 'Full name is required.';
    if (data.request_type === 'business' && !data.email.trim()) {
      nextErrors.email = 'Email is required for business requests.';
    }
    if (!data.phone_local.trim())
      nextErrors.phone_local = 'Phone number is required.';
    if (!data.category) nextErrors.category = 'Category is required.';
    if (!data.pickup_address.trim())
      nextErrors.pickup_address = 'Pickup address is required.';
    if (data.evaluation_decision === 'approved') {
      const price = Number(data.evaluation_price);
      if (!data.evaluation_price || Number.isNaN(price) || price <= 0) {
        nextErrors.evaluation_price = 'Enter a valid price.';
      }
    } else if (
      data.evaluation_decision === 'rejected' &&
      !data.evaluation_reason.trim()
    ) {
      nextErrors.evaluation_reason = 'A reason is required when rejecting.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate(formData)) return;

    const payload = {
      full_name: formData.full_name,
      email: formData.email || undefined,
      phone_number:
        joinPhoneNumber(formData.phone_dial_code, formData.phone_local) ||
        undefined,
      category: formData.category,
      request_type: formData.request_type,
      pickup_address: formData.pickup_address,
      photo: photoKey || undefined,
      estimated_quantity: formData.estimated_quantity || undefined,
      quantity_unit: formData.quantity_unit || undefined,
      note: formData.note || undefined,
    };

    try {
      const request = leadId
        ? await convertLead(leadId, payload)
        : await createRequest(payload);

      if (formData.evaluation_decision !== 'none') {
        try {
          await evaluateRequest(request.id, {
            decision: formData.evaluation_decision,
            price:
              formData.evaluation_decision === 'approved'
                ? formData.evaluation_price
                : undefined,
            note:
              formData.evaluation_decision === 'rejected'
                ? formData.evaluation_reason
                : undefined,
          });
          toast.success(
            'Pickup request created',
            `A request for ${formData.full_name} has been added and ${formData.evaluation_decision}.`,
          );
        } catch {
          // The request itself was created fine — only the follow-up
          // evaluate call failed — so this isn't the generic failure
          // toast; it's created, just needs evaluating manually now.
          toast.error(
            'Request created, but evaluation failed',
            'Open the request and evaluate it from there.',
          );
        }
      } else {
        toast.success(
          'Pickup request created',
          `A request for ${formData.full_name} has been added.`,
        );
      }
      router.push(`${basePath}/${request.id}`);
    } catch {
      // useCreatePickupRequest/useConvertQuickPickupRequest already
      // captured the message in `error`, shown below.
    }
  };

  if (leadId && loadingLead) return <Loading text="Loading lead…" />;

  return (
    <PageContainer variant="form">
      <Link
        href={basePath}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <LuArrowLeft className="size-4" />
        Back to pickup requests
      </Link>

      <PageHeader
        title={leadId ? 'Follow up on quick lead' : 'New pickup request'}
        subtitle={
          leadId
            ? 'Complete the rest of the details to create the real request.'
            : 'Log a request taken over the phone or in person.'
        }
      />

      <Card className="p-5">
        <form onSubmit={handleSubmit}>
          <AlertBanner message={error} />

          <div className="grid gap-x-4 sm:grid-cols-2">
            <InputField
              label="Full name"
              field="full_name"
              placeholder="e.g. Fatima Ali"
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <InputField
              label="Email"
              field="email"
              type="email"
              required={formData.request_type === 'business'}
              placeholder="e.g. fatima@recyclinghub.example"
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <PhoneInputField
              label="Phone number"
              dialCodeField="phone_dial_code"
              numberField="phone_local"
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <SelectField
              label="Material category"
              field="category"
              options={categoryOptions}
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting || loadingCategories}
            />
            <SelectField
              label="Request type"
              field="request_type"
              options={REQUEST_TYPE_OPTIONS}
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <div className="sm:col-span-2">
              <InputField
                label="Pickup address"
                field="pickup_address"
                placeholder="Address where materials should be collected"
                formData={formData}
                errors={errors}
                updateFormData={updateFormData}
                disabled={submitting}
              />
            </div>
            <InputField
              label="Estimated quantity"
              field="estimated_quantity"
              type="number"
              required={false}
              placeholder="e.g. 5"
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <InputField
              label="Quantity unit"
              field="quantity_unit"
              required={false}
              placeholder="e.g. kg"
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <div className="sm:col-span-2">
              <PickupPhotoUploader
                value={photoPreview}
                onChange={(key) => {
                  setPhotoKey(key);
                  setPhotoPreview(
                    key ? { file_key: key, public_url: null } : null,
                  );
                }}
                disabled={submitting}
              />
            </div>
            <div className="sm:col-span-2">
              <TextareaField
                label="Note"
                field="note"
                required={false}
                placeholder="Anything else worth noting"
                formData={formData}
                errors={errors}
                updateFormData={updateFormData}
                disabled={submitting}
              />
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3.5">
            <div className="col-span-2 text-xs font-medium text-slate-500">
              Evaluate now — optional. Skips the separate Evaluate step on the
              details page if you already know the outcome.
            </div>
            <div className="col-span-2">
              <SelectField
                label="Evaluate now"
                field="evaluation_decision"
                required={false}
                options={EVALUATE_NOW_OPTIONS}
                formData={formData}
                errors={errors}
                updateFormData={updateFormData}
                disabled={submitting}
              />
            </div>
            {formData.evaluation_decision === 'approved' && (
              <InputField
                label="Price"
                field="evaluation_price"
                type="number"
                placeholder="Required to approve."
                formData={formData}
                errors={errors}
                updateFormData={updateFormData}
                disabled={submitting}
              />
            )}
            {formData.evaluation_decision === 'rejected' && (
              <div className="col-span-2">
                <TextareaField
                  label="Reason"
                  field="evaluation_reason"
                  placeholder="Required to reject."
                  formData={formData}
                  errors={errors}
                  updateFormData={updateFormData}
                  disabled={submitting}
                />
              </div>
            )}
          </div>

          <div className="flex gap-5 pt-2">
            <Button href={basePath} variant="secondary" className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting ? 'Creating…' : 'Create request'}
            </Button>
          </div>
        </form>
      </Card>
    </PageContainer>
  );
};

export { CreatePickupRequestView };
