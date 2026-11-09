'use client';

import { type FormEvent, useEffect, useRef } from 'react';
import {
  LuCircleAlert,
  LuClipboardCheck,
  LuClipboardList,
  LuPencil,
  LuPhoneCall,
  LuTruck,
} from 'react-icons/lu';

import { AddressInput } from '../../../../form/fields/AddressInput';
import { InputField } from '../../../../form/fields/InputField';
import { PhoneInputField } from '../../../../form/fields/PhoneInputField';
import { TextareaField } from '../../../../form/fields/TextareaField';
import { PublicButton } from '../../../../ui/buttons/PublicButton';
import { IconTile } from '../../../../ui/card/IconTile';
import { SectionCard } from '../../../../ui/card/SectionCard';
import { DescriptionList } from '../../../../ui/DescriptionList';
import { FadeIn } from '../../../../ui/FadeIn';
import { StepIndicator } from '../../../../ui/navigation/StepIndicator';
import { usePublicPickupRequestForm } from '../../hooks/usePublicPickupRequestForm';
import { fillTemplate } from '../../models/publicPickupRequestModel';
import { PickupPhotosUploader } from '../shared/PickupPhotosUploader';

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

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Public, anonymous Business / Bulk pickup request, as a step form:
 * your details → what to collect → anything else → review. Same public
 * POST /pickup-requests/ and payload as before (always `business`, 1–4
 * photos uploaded anonymously, no items and no pickup time — staff
 * agree one by phone). All state and rules live in
 * usePublicPickupRequestForm and its model; copy in EN + BM. */
const PublicPickupRequestForm = () => {
  const form = usePublicPickupRequestForm();
  const {
    copy,
    steps,
    stepId,
    stepIndex,
    isLastStep,
    formData,
    errors,
    submitting,
    updateField,
    blurField,
  } = form;

  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  // After a step change: bring the step into view and move focus to it.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const heading = headingRef.current;
    if (!heading) return;
    heading.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'center',
    });
    heading.focus({ preventScroll: true });
  }, [stepIndex]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLastStep) form.submit();
    else form.next();
  };

  const field = {
    formData,
    errors,
    updateFormData: updateField,
    disabled: submitting,
  };

  const step = steps[stepIndex]!;

  const editButton = (index: number) => (
    <button
      type="button"
      onClick={() => form.goTo(index)}
      className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-slate-200 px-3 text-xs font-semibold text-neutral-950 transition hover:border-brand-600 hover:text-brand-700"
    >
      <LuPencil className="size-3.5" aria-hidden />
      {copy.editButton}
      <span className="sr-only"> {steps[index]!.label}</span>
    </button>
  );

  return (
    <section className="bg-white pb-16 md:pb-20">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <FadeIn>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
              <header className="flex items-start gap-3 border-b border-slate-100 p-6 md:px-8">
                <IconTile icon={<LuClipboardList />} size="sm" />
                <div className="min-w-0">
                  <h2 className="text-2xl font-bold text-neutral-950 sm:text-3xl">
                    {copy.heading}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    {copy.requiredNote}
                  </p>
                </div>
              </header>

              <div className="border-b border-slate-100 px-6 py-3 md:px-8">
                <StepIndicator
                  label={copy.stepsLabel}
                  steps={steps}
                  current={stepIndex}
                  completed={form.completed}
                  reached={form.reached}
                  onStepClick={form.goTo}
                />
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <div
                  key={stepId}
                  className="p-6 motion-safe:animate-page-enter md:px-8"
                  data-step={stepId}
                >
                  <h3
                    ref={headingRef}
                    tabIndex={-1}
                    className="text-base font-semibold text-neutral-950 focus:outline-none"
                  >
                    {step.label}
                  </h3>
                  <p className="mb-5 mt-1 text-sm text-slate-500">
                    {step.description}
                  </p>

                  {stepId === 'details' && (
                    <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <InputField
                          label={copy.fullName}
                          field="full_name"
                          placeholder={copy.fullNamePlaceholder}
                          onBlur={() => blurField('full_name')}
                          {...field}
                        />
                      </div>
                      <InputField
                        label={copy.email}
                        field="email"
                        type="email"
                        required
                        placeholder={copy.emailPlaceholder}
                        onBlur={() => blurField('email')}
                        {...field}
                      />
                      <PhoneInputField
                        label={copy.phone}
                        dialCodeField="phone_dial_code"
                        numberField="phone_local"
                        placeholder={copy.phonePlaceholder}
                        onBlur={() => blurField('phone_local')}
                        {...field}
                      />
                    </div>
                  )}

                  {stepId === 'collect' && (
                    <>
                      {/* Same live-autocomplete address input as the admin
                          create/edit forms. */}
                      <AddressInput
                        label={copy.pickupAddress}
                        field="pickup_address"
                        placeholder={copy.pickupAddressPlaceholder}
                        countryRestrictions={['my']}
                        onSelect={form.setSelectedLocation}
                        onClear={() => form.setSelectedLocation(null)}
                        onBlur={() => blurField('pickup_address')}
                        {...field}
                      />
                      {form.selectedLocation && (
                        <p className="-mt-3 mb-4 text-xs text-slate-400">
                          {copy.addressVerifiedAt}{' '}
                          {form.selectedLocation.latitude.toFixed(5)},{' '}
                          {form.selectedLocation.longitude.toFixed(5)}
                        </p>
                      )}
                      <PickupPhotosUploader
                        value={form.photos}
                        onChange={form.changePhotos}
                        upload={form.upload}
                        onUploadingChange={form.setUploading}
                        disabled={submitting}
                        label={copy.photos}
                        helperText={copy.photosHelper}
                        addLabel={copy.photosAdd}
                        error={errors.photos}
                      />
                    </>
                  )}

                  {stepId === 'note' && (
                    <TextareaField
                      label={copy.note}
                      field="note"
                      required={false}
                      placeholder={copy.notePlaceholder}
                      {...field}
                    />
                  )}

                  {stepId === 'review' && (
                    <div className="space-y-4">
                      {form.apiError && (
                        <div
                          role="alert"
                          className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                        >
                          <LuCircleAlert className="mt-0.5 size-4 shrink-0" />
                          <span>{form.apiError}</span>
                        </div>
                      )}
                      <SectionCard
                        title={steps[0]!.label}
                        action={editButton(0)}
                      >
                        <DescriptionList
                          items={[
                            { label: copy.fullName, value: formData.full_name },
                            { label: copy.email, value: formData.email },
                            {
                              label: copy.phone,
                              value: formData.phone_local
                                ? `${formData.phone_dial_code} ${formData.phone_local}`
                                : '',
                            },
                          ]}
                        />
                      </SectionCard>
                      <SectionCard
                        title={steps[1]!.label}
                        action={editButton(1)}
                      >
                        <DescriptionList
                          items={[
                            {
                              label: copy.pickupAddress,
                              value: formData.pickup_address,
                            },
                            {
                              label: copy.photos,
                              value: form.photos.length ? (
                                <span className="flex flex-wrap items-center gap-2">
                                  {form.photos.map((photo) =>
                                    photo.public_url ? (
                                      // eslint-disable-next-line @next/next/no-img-element -- remote/presigned URL, not a static asset
                                      <img
                                        key={photo.file_key}
                                        src={photo.public_url}
                                        alt=""
                                        className="size-12 rounded-lg border border-slate-200 object-cover"
                                      />
                                    ) : null,
                                  )}
                                  <span className="text-slate-500">
                                    {fillTemplate(copy.photoCount, {
                                      count: form.photos.length,
                                    })}
                                  </span>
                                </span>
                              ) : (
                                ''
                              ),
                            },
                          ]}
                        />
                      </SectionCard>
                      <SectionCard
                        title={steps[2]!.label}
                        action={editButton(2)}
                      >
                        <DescriptionList
                          items={[{ label: copy.note, value: formData.note }]}
                        />
                      </SectionCard>
                    </div>
                  )}
                </div>

                {/* Sticky footer. On phones the right padding keeps the
                    buttons clear of the floating WhatsApp button. */}
                <div className="sticky bottom-0 z-10 flex flex-wrap items-center justify-between gap-3 rounded-b-3xl border-t border-slate-100 bg-white/95 px-6 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pe-[5.5rem] backdrop-blur sm:pe-6 md:px-8">
                  <p className="text-sm text-slate-500" aria-live="polite">
                    <span className="font-semibold text-neutral-950">
                      {fillTemplate(copy.stepOf, {
                        current: stepIndex + 1,
                        total: steps.length,
                      })}
                    </span>
                    <span className="hidden sm:inline">
                      {' · '}
                      {fillTemplate(copy.doneCount, {
                        count: form.completed.size,
                      })}
                    </span>
                  </p>
                  <div className="flex w-full items-center gap-2 sm:w-auto">
                    {stepIndex > 0 && (
                      <PublicButton
                        type="button"
                        variant="secondary"
                        onClick={form.back}
                        disabled={submitting}
                        className="flex-1 sm:flex-none"
                      >
                        {copy.backButton}
                      </PublicButton>
                    )}
                    <PublicButton
                      type="submit"
                      disabled={submitting}
                      className="flex-1 sm:flex-none"
                    >
                      {isLastStep && submitting && copy.submittingButton}
                      {isLastStep && !submitting && copy.submitButton}
                      {!isLastStep && copy.continueButton}
                    </PublicButton>
                  </div>
                </div>
              </form>
            </div>

            <NextSteps title={copy.nextTitle} steps={copy.nextSteps} />
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export { PublicPickupRequestForm };
