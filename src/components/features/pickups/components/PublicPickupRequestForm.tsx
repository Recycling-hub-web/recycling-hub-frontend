'use client';

import { type FormEvent, useState } from 'react';
import { LuBuilding2, LuSmartphone } from 'react-icons/lu';

import { joinPhoneNumber } from '../../../../constants/dialCodes';
import { useDictionary } from '../../../../hooks/useDictionary';
import { ApiError } from '../../../../lib/api';
import { InputField } from '../../../form/fields/InputField';
import { PhoneInputField } from '../../../form/fields/PhoneInputField';
import { SelectField } from '../../../form/fields/SelectField';
import { TextareaField } from '../../../form/fields/TextareaField';
import { Button } from '../../../ui/buttons/Button';
import { FadeIn } from '../../../ui/FadeIn';
import { useToast } from '../../../ui/toast/ToastContext';
import { useCreatePickupRequest, usePickupCategories } from '../hooks';
import { PICKUP_REQUEST_TYPE_LABELS, type PickupRequestType } from '../types';
import { type Photo, PickupPhotoUploader } from './PickupPhotoUploader';

const REQUEST_TYPE_ICONS = {
  individual: LuSmartphone,
  business: LuBuilding2,
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormState = {
  full_name: string;
  email: string;
  // Split for PhoneInputField's own dialCodeField/numberField contract —
  // joined back into the single `phone_number` string the backend
  // actually stores only at submit time (see joinPhoneNumber).
  phone_dial_code: string;
  phone_local: string;
  category: string;
  pickup_address: string;
  estimated_quantity: string;
  quantity_unit: string;
  note: string;
};

const INITIAL_STATE: FormState = {
  full_name: '',
  email: '',
  phone_dial_code: '+60',
  phone_local: '',
  category: '',
  pickup_address: '',
  estimated_quantity: '',
  quantity_unit: '',
  note: '',
};

type PublicPickupRequestFormProps = {
  requestType: PickupRequestType;
  onSelectType: (type: PickupRequestType) => void;
};

/** Public, anonymous pickup-request form — posts straight to the real
 * CollectionRequest endpoint (AllowAny on create, same as
 * ContactFormSection), no account required. Same underlying
 * useCreatePickupRequest hook as the admin/staff "New request" action.
 * Shared by both PickupTypeSelector choices — `requestType` is the only
 * thing that differs between an individual and a business submission.
 * The type toggle below reuses the same icon+label design as
 * PickupTypeSelector so switching reads as the same choice, not a
 * different control — and switches instantly, no separate step. */
const PublicPickupRequestForm = ({
  requestType,
  onSelectType,
}: PublicPickupRequestFormProps) => {
  const {
    pickupRequest: { form: content },
  } = useDictionary();
  const toast = useToast();
  const { execute: createRequest, loading: submitting } =
    useCreatePickupRequest();
  const { options: categoryOptions, loading: loadingCategories } =
    usePickupCategories();

  const [formData, setFormData] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [photoKey, setPhotoKey] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<Photo>(null);

  const isBusiness = requestType === 'business';

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // Validated on submit, not proactively — same rule as ContactFormSection.
  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};
    if (!formData.full_name.trim())
      nextErrors.full_name = content.errorFullNameRequired;
    if (isBusiness && !formData.email.trim()) {
      nextErrors.email = content.errorEmailRequired;
    } else if (formData.email.trim() && !EMAIL_PATTERN.test(formData.email)) {
      nextErrors.email = content.errorEmailInvalid;
    }
    if (!formData.phone_local.trim())
      nextErrors.phone_local = content.errorPhoneRequired;
    if (!formData.category) nextErrors.category = content.errorCategoryRequired;
    if (!formData.pickup_address.trim())
      nextErrors.pickup_address = content.errorAddressRequired;
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    try {
      await createRequest({
        full_name: formData.full_name.trim(),
        email: formData.email.trim() || undefined,
        phone_number:
          joinPhoneNumber(
            formData.phone_dial_code,
            formData.phone_local.trim(),
          ) || undefined,
        category: formData.category,
        request_type: requestType,
        pickup_address: formData.pickup_address.trim(),
        photo: photoKey || undefined,
        estimated_quantity: formData.estimated_quantity.trim() || undefined,
        quantity_unit: formData.quantity_unit.trim() || undefined,
        note: formData.note.trim() || undefined,
      });
      setPhotoKey(null);
      setPhotoPreview(null);
      // Create action a visitor could plausibly repeat (another address,
      // another batch) — stay on the page and reset in place, same as
      // ContactFormSection, rather than navigating or freezing the form.
      setFormData(INITIAL_STATE);
      setErrors({});
      toast.success(content.successMessage);
    } catch (err) {
      setApiError(err instanceof ApiError ? err.message : content.errorMessage);
    }
  };

  return (
    <section className="bg-white pb-16 md:pb-20">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <FadeIn>
          <div className="rounded-3xl border border-slate-200 p-6 shadow-sm md:p-10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-neutral-950 sm:text-3xl">
                  {content.heading}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  {content.subheading}
                </p>
              </div>
              <div className="inline-flex shrink-0 rounded-full border border-slate-200 bg-slate-50 p-1">
                {(Object.keys(REQUEST_TYPE_ICONS) as PickupRequestType[]).map(
                  (type) => {
                    const Icon = REQUEST_TYPE_ICONS[type];
                    const active = type === requestType;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => onSelectType(type)}
                        aria-pressed={active}
                        className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition ${
                          active
                            ? 'bg-white text-brand-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        <Icon size={16} />
                        {PICKUP_REQUEST_TYPE_LABELS[type]}
                      </button>
                    );
                  },
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate className="mt-6">
              <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                <InputField
                  label={content.fullName}
                  field="full_name"
                  placeholder={content.fullNamePlaceholder}
                  formData={formData}
                  errors={errors}
                  updateFormData={updateField}
                  disabled={submitting}
                />
                <InputField
                  label={content.email}
                  field="email"
                  type="email"
                  required={isBusiness}
                  placeholder={content.emailPlaceholder}
                  formData={formData}
                  errors={errors}
                  updateFormData={updateField}
                  disabled={submitting}
                />
                <PhoneInputField
                  label={content.phone}
                  dialCodeField="phone_dial_code"
                  numberField="phone_local"
                  placeholder={content.phonePlaceholder}
                  formData={formData}
                  errors={errors}
                  updateFormData={updateField}
                  disabled={submitting}
                />
                <SelectField
                  label={content.category}
                  field="category"
                  options={categoryOptions}
                  formData={formData}
                  errors={errors}
                  updateFormData={updateField}
                  disabled={submitting || loadingCategories}
                />
                <div className="sm:col-span-2">
                  <InputField
                    label={content.pickupAddress}
                    field="pickup_address"
                    placeholder={content.pickupAddressPlaceholder}
                    formData={formData}
                    errors={errors}
                    updateFormData={updateField}
                    disabled={submitting}
                  />
                </div>
                <InputField
                  label={content.estimatedQuantity}
                  field="estimated_quantity"
                  type="number"
                  required={false}
                  placeholder={content.estimatedQuantityPlaceholder}
                  formData={formData}
                  errors={errors}
                  updateFormData={updateField}
                  disabled={submitting}
                />
                <InputField
                  label={content.quantityUnit}
                  field="quantity_unit"
                  required={false}
                  placeholder={content.quantityUnitPlaceholder}
                  formData={formData}
                  errors={errors}
                  updateFormData={updateField}
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
                    label={content.note}
                    field="note"
                    required={false}
                    placeholder={content.notePlaceholder}
                    formData={formData}
                    errors={errors}
                    updateFormData={updateField}
                    disabled={submitting}
                  />
                </div>
              </div>

              {apiError && (
                <p className="mt-4 text-sm text-red-500">{apiError}</p>
              )}

              <div className="mt-6 flex justify-end">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto"
                >
                  {submitting ? content.submittingButton : content.submitButton}
                </Button>
              </div>
            </form>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export { PublicPickupRequestForm };
