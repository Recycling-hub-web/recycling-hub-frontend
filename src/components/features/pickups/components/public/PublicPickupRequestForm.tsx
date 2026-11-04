'use client';

import { type FormEvent, useState } from 'react';

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
  requested_at: string;
  note: string;
};

const INITIAL_STATE: FormState = {
  full_name: '',
  email: '',
  phone_dial_code: '+60',
  phone_local: '',
  pickup_address: '',
  requested_at: '',
  note: '',
};

/** Public, anonymous business/bulk pickup-request form — posts straight
 * to the real PickupRequest endpoint (AllowAny on create, same as
 * ContactFormSection), no account required. The customer's ask only:
 * contact info, address, a chosen pickup date/time and 1–4 photos of
 * what to collect (uploaded anonymously via uploadPublicPickupPhoto).
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
    if (!formData.requested_at)
      nextErrors.requested_at = content.errorRequestedAtRequired;
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
        requested_at: new Date(formData.requested_at).toISOString(),
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
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <FadeIn>
          <div className="rounded-3xl border border-slate-200 p-6 shadow-sm md:p-10">
            <h2 className="text-2xl font-bold text-neutral-950 sm:text-3xl">
              {content.heading}
            </h2>
            <p className="mt-2 text-sm text-slate-500">{content.subheading}</p>

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
                <InputField
                  label={content.requestedAt}
                  field="requested_at"
                  type="datetime-local"
                  placeholder={content.requestedAtPlaceholder}
                  formData={formData}
                  errors={errors}
                  updateFormData={updateField}
                  disabled={submitting}
                />
                <div className="sm:col-span-2">
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
                </div>
                <div className="sm:col-span-2">
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
                <PublicButton
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto"
                >
                  {submitting ? content.submittingButton : content.submitButton}
                </PublicButton>
              </div>
            </form>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export { PublicPickupRequestForm };
