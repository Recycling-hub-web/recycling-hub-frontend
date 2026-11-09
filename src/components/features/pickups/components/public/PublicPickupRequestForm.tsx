'use client';

import { type FormEvent, type ReactNode, useState } from 'react';
import {
  LuCircleAlert,
  LuClipboardCheck,
  LuMapPin,
  LuMessageSquare,
  LuPhoneCall,
  LuTruck,
  LuUser,
} from 'react-icons/lu';

import {
  joinPhoneNumber,
  validatePhoneNumber,
} from '../../../../../constants/dialCodes';
import { useDictionary } from '../../../../../hooks/useDictionary';
import { ApiError } from '../../../../../lib/api';
import type { SelectedAddress } from '../../../../../lib/geoapify';
import { AddressInput } from '../../../../form/fields/AddressInput';
import { InputField } from '../../../../form/fields/InputField';
import { PhoneInputField } from '../../../../form/fields/PhoneInputField';
import { TextareaField } from '../../../../form/fields/TextareaField';
import { PublicButton } from '../../../../ui/buttons/PublicButton';
import { FadeIn } from '../../../../ui/FadeIn';
import { useToast } from '../../../../ui/toast/ToastContext';
import { useCreatePickupRequest } from '../../hooks';
import { uploadPublicPickupPhoto } from '../../services/pickupService';
import {
  type OrderPhoto,
  PickupPhotosUploader,
} from '../shared/PickupPhotosUploader';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormState = {
  full_name: string;
  email: string;
  // Split for PhoneInputField's own dialCodeField/numberField contract —
  // joined back into the single `phone_number` string the backend
  // actually stores only at submit time (see joinPhoneNumber).
  phone_dial_code: string;
  phone_local: string;
  pickup_address: string;
  note: string;
};

const INITIAL_STATE: FormState = {
  full_name: '',
  email: '',
  phone_dial_code: '+60',
  phone_local: '',
  pickup_address: '',
  note: '',
};

type FormSectionProps = {
  step: number;
  icon: ReactNode;
  title: string;
  children: ReactNode;
};

/** One numbered group of fields — a fieldset whose legend is the
 * section title, so screen readers announce it with each field. */
const FormSection = ({ step, icon, title, children }: FormSectionProps) => (
  // The divider sits on a wrapper, not the fieldset: browsers draw a
  // fieldset's top border through its legend. The floated legend renders
  // as a normal block, so the spacing under it is just its own margin.
  <div className="border-t border-slate-100 pt-6 first:border-t-0 first:pt-0">
    <fieldset className="min-w-0">
      <legend className="float-left mb-4 flex w-full items-center gap-2.5 text-sm font-semibold text-neutral-950">
        <span
          aria-hidden
          className="flex size-7 items-center justify-center rounded-lg bg-brand-50 text-brand-700"
        >
          {icon}
        </span>
        <span>
          <span className="sr-only">{step}. </span>
          {title}
        </span>
      </legend>
      <div className="clear-left">{children}</div>
    </fieldset>
  </div>
);

type NextStepsProps = {
  title: string;
  steps: { title: string; body: string }[];
};

const STEP_ICONS = [LuClipboardCheck, LuPhoneCall, LuTruck];

/** Beside the form on desktop, under it on mobile: what the customer
 * can expect after submitting — there's no pickup time to choose here,
 * staff agree one by phone. */
const NextSteps = ({ title, steps }: NextStepsProps) => (
  <aside className="rounded-3xl border border-brand-100 bg-brand-50/60 p-6 lg:sticky lg:top-28">
    <h3 className="text-base font-semibold text-neutral-950">{title}</h3>
    <ol className="mt-5 space-y-5">
      {steps.map((item, i) => {
        const Icon = STEP_ICONS[i] ?? LuClipboardCheck;
        return (
          <li key={item.title} className="relative flex gap-3">
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className="absolute left-[1.125rem] top-10 h-[calc(100%-1.25rem)] w-px bg-brand-200"
              />
            )}
            <span
              aria-hidden
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-brand-700 ring-1 ring-brand-200"
            >
              <Icon size={16} />
            </span>
            <span className="min-w-0 pt-1">
              <span className="block text-sm font-semibold text-neutral-950">
                {item.title}
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-slate-600">
                {item.body}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  </aside>
);

/** Public, anonymous business/bulk pickup-request form — posts straight
 * to the real PickupRequest endpoint (AllowAny on create, same as
 * ContactFormSection), no account required. The customer's ask only:
 * contact info, address and 1–4 photos of what to collect — no pickup
 * time: staff agree one with the customer by phone (uploaded anonymously via uploadPublicPickupPhoto).
 * No items — those belong to an Order, created later by staff once
 * this request has been reviewed (see CreateOrderView). Same
 * useCreatePickupRequest hook as the admin/staff "New pickup request"
 * action. Always `request_type: 'business'` — the public site has no
 * individual/household option; individuals use the callback form. */
const PublicPickupRequestForm = () => {
  const {
    pickupRequest: { form: content },
  } = useDictionary();
  const toast = useToast();
  const { execute: createRequest, loading: submitting } =
    useCreatePickupRequest();

  const [formData, setFormData] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedAddress | null>(null);
  const [apiError, setApiError] = useState('');
  const [photos, setPhotos] = useState<OrderPhoto[]>([]);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // Validated on submit, not proactively — same rule as ContactFormSection.
  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};
    if (!formData.full_name.trim())
      nextErrors.full_name = content.errorFullNameRequired;
    if (!formData.email.trim()) {
      nextErrors.email = content.errorEmailRequired;
    } else if (formData.email.trim() && !EMAIL_PATTERN.test(formData.email)) {
      nextErrors.email = content.errorEmailInvalid;
    }
    const phoneError = validatePhoneNumber(
      formData.phone_dial_code,
      formData.phone_local,
      {
        messages: {
          required: content.errorPhoneRequired,
          invalid: content.errorPhoneInvalid,
        },
      },
    );
    if (phoneError) nextErrors.phone_local = phoneError;
    if (!formData.pickup_address.trim())
      nextErrors.pickup_address = content.errorAddressRequired;
    if (!photos.length) nextErrors.photos = content.errorPhotosRequired;
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
        phone_number: joinPhoneNumber(
          formData.phone_dial_code,
          formData.phone_local.trim(),
        ),
        request_type: 'business',
        pickup_address: formData.pickup_address.trim(),
        note: formData.note.trim() || undefined,
        photos: photos.map((p) => p.file_key),
      });
      // Create action a visitor could plausibly repeat (another address,
      // another batch) — stay on the page and reset in place, same as
      // ContactFormSection, rather than navigating or freezing the form.
      setFormData(INITIAL_STATE);
      setPhotos([]);
      setSelectedLocation(null);
      setErrors({});
      toast.success(content.successMessage);
    } catch (err) {
      setApiError(err instanceof ApiError ? err.message : content.errorMessage);
    }
  };

  return (
    <section className="bg-white pb-16 md:pb-20">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <FadeIn>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
              <h2 className="text-2xl font-bold text-neutral-950 sm:text-3xl">
                {content.heading}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {content.subheading}
              </p>

              <form onSubmit={handleSubmit} noValidate className="mt-8">
                <FormSection
                  step={1}
                  icon={<LuUser size={16} />}
                  title={content.sectionDetails}
                >
                  <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <InputField
                        label={content.fullName}
                        field="full_name"
                        placeholder={content.fullNamePlaceholder}
                        formData={formData}
                        errors={errors}
                        updateFormData={updateField}
                        disabled={submitting}
                      />
                    </div>
                    <InputField
                      label={content.email}
                      field="email"
                      type="email"
                      required
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
                  </div>
                </FormSection>

                <FormSection
                  step={2}
                  icon={<LuMapPin size={16} />}
                  title={content.sectionPickup}
                >
                  {/* Same live-autocomplete address input as the admin
                      create/edit forms. */}
                  <AddressInput
                    label={content.pickupAddress}
                    field="pickup_address"
                    placeholder={content.pickupAddressPlaceholder}
                    formData={formData}
                    errors={errors}
                    updateFormData={updateField}
                    disabled={submitting}
                    countryRestrictions={['my']}
                    onSelect={setSelectedLocation}
                    onClear={() => setSelectedLocation(null)}
                  />
                  {selectedLocation && (
                    <p className="-mt-3 mb-4 text-xs text-slate-400">
                      {content.addressVerifiedAt}{' '}
                      {selectedLocation.latitude.toFixed(5)},{' '}
                      {selectedLocation.longitude.toFixed(5)}
                    </p>
                  )}
                  <PickupPhotosUploader
                    value={photos}
                    onChange={(next) => {
                      setPhotos(next);
                      if (next.length) {
                        setErrors((prev) => ({ ...prev, photos: '' }));
                      }
                    }}
                    upload={uploadPublicPickupPhoto}
                    disabled={submitting}
                    label={content.photos}
                    helperText={content.photosHelper}
                    addLabel={content.photosAdd}
                    error={errors.photos}
                  />
                </FormSection>

                <FormSection
                  step={3}
                  icon={<LuMessageSquare size={16} />}
                  title={content.sectionNote}
                >
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
                </FormSection>

                {apiError && (
                  <div
                    role="alert"
                    className="mt-2 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    <LuCircleAlert className="mt-0.5 size-4 shrink-0" />
                    <span>{apiError}</span>
                  </div>
                )}

                <div className="mt-6 flex justify-end border-t border-slate-100 pt-6">
                  <PublicButton
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto"
                  >
                    {submitting
                      ? content.submittingButton
                      : content.submitButton}
                  </PublicButton>
                </div>
              </form>
            </div>

            <NextSteps title={content.nextTitle} steps={content.nextSteps} />
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export { PublicPickupRequestForm };
