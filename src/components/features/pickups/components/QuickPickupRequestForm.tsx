'use client';

import { type FormEvent, useState } from 'react';
import { LuBuilding2, LuSmartphone } from 'react-icons/lu';

import { joinPhoneNumber } from '../../../../constants/dialCodes';
import { useDictionary } from '../../../../hooks/useDictionary';
import { ApiError } from '../../../../lib/api';
import { PhoneInputField } from '../../../form/fields/PhoneInputField';
import { Button } from '../../../ui/buttons/Button';
import { FadeIn } from '../../../ui/FadeIn';
import { useToast } from '../../../ui/toast/ToastContext';
import { useCreateQuickPickupRequest } from '../hooks';
import { PICKUP_REQUEST_TYPE_LABELS, type PickupRequestType } from '../types';

const REQUEST_TYPE_ICONS = {
  individual: LuSmartphone,
  business: LuBuilding2,
} as const;

type FormState = {
  request_type: PickupRequestType;
  phone_dial_code: string;
  phone_local: string;
};

const INITIAL_STATE: FormState = {
  request_type: 'individual',
  phone_dial_code: '+60',
  phone_local: '',
};

/** The low-friction alternative to PublicPickupRequestForm — just a
 * type and a phone number, no name/email/category/address. Posts to the
 * separate PickupQuickRequest endpoint (not CollectionRequest directly —
 * see the quick-pickup-requests plan for why); staff complete the rest
 * later via CreatePickupRequestView's convert path, which links back to
 * this same submission. */
const QuickPickupRequestForm = () => {
  const {
    pickupRequest: { quickForm: content },
  } = useDictionary();
  const toast = useToast();
  const { execute: createQuickRequest, loading: submitting } =
    useCreateQuickPickupRequest();

  const [formData, setFormData] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError('');

    if (!formData.phone_local.trim()) {
      setErrors({ phone_local: content.errorPhoneRequired });
      return;
    }

    try {
      await createQuickRequest({
        request_type: formData.request_type,
        phone_number: joinPhoneNumber(
          formData.phone_dial_code,
          formData.phone_local.trim(),
        ),
      });
      setFormData(INITIAL_STATE);
      setErrors({});
      toast.success(content.successMessage);
    } catch (err) {
      setApiError(err instanceof ApiError ? err.message : content.errorMessage);
    }
  };

  return (
    <section className="bg-white pb-16 md:pb-20">
      <div className="mx-auto max-w-md px-5 md:px-8">
        <FadeIn>
          <div className="rounded-3xl border border-slate-200 p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-bold text-neutral-950">
              {content.heading}
            </h2>
            <p className="mt-2 text-sm text-slate-500">{content.subheading}</p>

            <form onSubmit={handleSubmit} noValidate className="mt-6">
              <div className="inline-flex w-full rounded-full border border-slate-200 bg-slate-50 p-1">
                {(Object.keys(REQUEST_TYPE_ICONS) as PickupRequestType[]).map(
                  (type) => {
                    const Icon = REQUEST_TYPE_ICONS[type];
                    const active = type === formData.request_type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => updateField('request_type', type)}
                        aria-pressed={active}
                        className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition ${
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

              <div className="mt-4">
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

              {apiError && (
                <p className="mt-4 text-sm text-red-500">{apiError}</p>
              )}

              <div className="mt-6">
                <Button type="submit" disabled={submitting} className="w-full">
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

export { QuickPickupRequestForm };
