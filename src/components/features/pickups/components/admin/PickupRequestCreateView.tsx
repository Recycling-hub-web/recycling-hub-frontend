'use client';

import Link from 'next/link';
import { type FormEvent, useEffect, useRef } from 'react';
import { LuArrowLeft, LuClipboardList, LuPencil } from 'react-icons/lu';

import { usePortalLocale } from '../../../../../contexts/PortalLocaleContext';
import { localizeErrors } from '../../../../../lib/localizeErrors';
import { AddressInput } from '../../../../form/fields/AddressInput';
import { InputField } from '../../../../form/fields/InputField';
import { PhoneInputField } from '../../../../form/fields/PhoneInputField';
import { SelectField } from '../../../../form/fields/SelectField';
import { TextareaField } from '../../../../form/fields/TextareaField';
import { ValidatedForm } from '../../../../form/ValidatedForm';
import { PageContainer } from '../../../../layout/PageContainer';
import { AlertBanner } from '../../../../ui/AlertBanner';
import { Button } from '../../../../ui/buttons/Button';
import { Card } from '../../../../ui/card/Card';
import { IconTile } from '../../../../ui/card/IconTile';
import { SectionCard } from '../../../../ui/card/SectionCard';
import { DescriptionList } from '../../../../ui/DescriptionList';
import { StepIndicator } from '../../../../ui/navigation/StepIndicator';
import {
  type PickupRequestBasePath,
  usePickupRequestCreateForm,
} from '../../hooks';
import {
  REQUEST_TYPE_OPTIONS,
  requestTypeLabel,
  STEPS,
} from '../../models/pickupRequestCreateModel';
import { PickupCategoryStatus } from '../shared/PickupCategoryStatus';
import type { DraftOrder } from './NewOrdersFieldArray';
import { NewOrdersFieldArray } from './NewOrdersFieldArray';
import {
  type DraftEvaluation,
  OrderEvaluationFields,
} from './OrderEvaluationFields';

type PickupRequestCreateViewProps = {
  basePath: PickupRequestBasePath;
};

const formatPickupTime = (value: string, dateLocale: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleString(dateLocale, {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
};

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Staff logging a pickup request taken over the phone or in person, as
 * a step form: customer → pickup → orders (optional) → review. Same
 * public POST /pickup-requests/ and payload as before; all state and
 * rules live in usePickupRequestCreateForm and its model. */
/** The review's evaluation line, e.g. "Approved, RM 120.50". */
const evaluationSummary = (
  evaluation: DraftEvaluation,
  orders: DraftOrder[],
  translate: (key: string, values?: Record<string, string | number>) => string,
) => {
  const itemCount = orders.reduce((n, o) => n + o.items.length, 0);
  if (evaluation.decision === 'rejected') {
    return translate('Rejected — {reason}', { reason: evaluation.note.trim() });
  }
  if (evaluation.decision !== 'approved') return translate('Not yet');
  const total =
    evaluation.itemized && itemCount > 1
      ? evaluation.itemPrices
          .slice(0, itemCount)
          .reduce((sum, p) => sum + (Number(p) || 0), 0)
      : Number(evaluation.price) || 0;
  return evaluation.itemized && itemCount > 1
    ? translate('Approved, RM {amount} (priced per item)', {
        amount: total.toFixed(2),
      })
    : translate('Approved, RM {amount}', { amount: total.toFixed(2) });
};

const PickupRequestCreateView = ({
  basePath,
}: PickupRequestCreateViewProps) => {
  const { t, locale } = usePortalLocale();
  const form = usePickupRequestCreateForm(basePath);
  const {
    step,
    stepIndex,
    isLastStep,
    formData,
    errors,
    submitting,
    updateFormData,
    blurField,
  } = form;

  const headingRef = useRef<HTMLHeadingElement>(null);
  const stepTopRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  // After a step change: bring the step into view and move focus to it.
  // Scrolls the step indicator row to the top, not the heading itself —
  // on short mobile viewports (address bar + this form's sticky footer +
  // the dashboard's bottom tab bar all eating vertical space), scrolling
  // the heading to 'start' or 'center' both left the step indicator
  // cropped or scrolled fully out of view above it.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const heading = headingRef.current;
    if (!heading) return;
    stepTopRef.current?.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'start',
    });
    heading.focus({ preventScroll: true });
  }, [stepIndex]);

  const errorsRef = useRef(errors);
  errorsRef.current = errors;
  useEffect(() => {
    const firstInvalid = Object.keys(errorsRef.current).find(
      (key) => errorsRef.current[key],
    );
    if (!firstInvalid) return undefined;
    const frame = requestAnimationFrame(() => {
      const field = document.querySelector<HTMLElement>(
        `[data-field="${firstInvalid}"]`,
      );
      const control = field?.querySelector<HTMLElement>(
        'input, select, textarea',
      );
      control?.focus({ preventScroll: true });
      field?.scrollIntoView({ block: 'center', behavior: 'auto' });
    });
    return () => cancelAnimationFrame(frame);
  }, [form.validationAttempt]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isLastStep) form.submit();
    else form.next();
  };

  const field = {
    formData,
    errors,
    updateFormData,
    disabled: submitting,
  };

  const editButton = (index: number) => (
    <Button variant="secondary" size="sm" onClick={() => form.goTo(index)}>
      <LuPencil className="me-1.5 size-3.5" aria-hidden />
      {t('Edit')}
      <span className="sr-only"> {t(STEPS[index]!.label).toLowerCase()}</span>
    </Button>
  );

  const categoryLabel = (id: string) =>
    form.categories.options.find((opt) => opt.value === id)?.label ?? id;

  return (
    <PageContainer variant="form">
      <Link
        href={basePath}
        className="mb-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-700 lg:mb-4 lg:min-h-0"
      >
        <LuArrowLeft className="size-4" />
        {t('Back to pickup requests')}
      </Link>

      <Card className="overflow-visible">
        <header className="flex items-start gap-3 border-b border-slate-100 p-5">
          <IconTile icon={<LuClipboardList />} size="sm" />
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-neutral-950">
              {t('New pickup request')}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {t('Fields marked')} <span className="text-red-600">*</span>{' '}
              {t('are required. You can review everything before you submit.')}
            </p>
          </div>
        </header>

        <div ref={stepTopRef} className="border-b border-slate-100 px-5 py-3">
          <StepIndicator
            label={t('New pickup request steps')}
            steps={STEPS.map((item) => ({ ...item, label: t(item.label) }))}
            current={stepIndex}
            completed={form.completed}
            reached={form.reached}
            onStepClick={form.goTo}
          />
        </div>

        <ValidatedForm
          onSubmit={handleSubmit}
          validationMode="external"
          fieldErrors={errors}
          noValidate
        >
          <div
            key={step.id}
            className="p-5 motion-safe:animate-page-enter"
            data-step={step.id}
          >
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="text-base font-semibold text-neutral-950 focus:outline-none"
            >
              {t(step.label)}
            </h2>
            <p className="mb-5 mt-1 text-sm text-slate-500">
              {t(step.description)}
            </p>

            {step.id === 'customer' && (
              <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                <InputField
                  label={t('Full name')}
                  field="full_name"
                  placeholder={t('e.g. Fatima Ali')}
                  onBlur={() => blurField('full_name')}
                  {...field}
                />
                <SelectField
                  label={t('Request type')}
                  field="request_type"
                  options={REQUEST_TYPE_OPTIONS.map((item) => ({
                    ...item,
                    label: t(item.label),
                  }))}
                  onBlur={() => blurField('email')}
                  {...field}
                />
                <InputField
                  label={t('Email')}
                  field="email"
                  type="email"
                  required={formData.request_type === 'business'}
                  placeholder={t('e.g. fatima@recyclinghub.example')}
                  onBlur={() => blurField('email')}
                  {...field}
                />
                <PhoneInputField
                  label={t('Phone number')}
                  dialCodeField="phone_dial_code"
                  numberField="phone_local"
                  onBlur={() => blurField('phone_local')}
                  {...field}
                />
              </div>
            )}

            {step.id === 'pickup' && (
              <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                <InputField
                  label={t('Pickup date & time')}
                  field="requested_at"
                  type="datetime-local"
                  required={false}
                  onBlur={() => blurField('requested_at')}
                  {...field}
                />
                <div className="sm:col-span-2">
                  <AddressInput
                    label={t('Pickup address')}
                    field="pickup_address"
                    placeholder={t(
                      'Address where materials should be collected',
                    )}
                    countryRestrictions={['my']}
                    onSelect={form.setSelectedLocation}
                    onClear={() => form.setSelectedLocation(null)}
                    onBlur={() => blurField('pickup_address')}
                    {...field}
                  />
                  {form.selectedLocation && (
                    <p className="-mt-3 mb-4 text-xs text-slate-600">
                      {t('Verified at')}
                      {form.selectedLocation.latitude.toFixed(5)},{' '}
                      {form.selectedLocation.longitude.toFixed(5)}
                    </p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <TextareaField
                    label={t('Note')}
                    field="note"
                    required={false}
                    placeholder={t('Anything else worth noting')}
                    {...field}
                  />
                </div>
              </div>
            )}

            {step.id === 'orders' && (
              <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                <PickupCategoryStatus
                  loading={form.categories.loading}
                  error={form.categories.error}
                  count={form.categories.options.length}
                  onRetry={form.categories.refetch}
                />
                <NewOrdersFieldArray
                  orders={form.orders}
                  onChange={form.setOrders}
                  categoryOptions={form.categories.options}
                  unitsByCategory={form.categories.unitsByCategory}
                  loadingCategories={form.categories.loading}
                  disabled={submitting}
                  itemErrors={form.orderItemErrors}
                  photoErrors={form.orderPhotoErrors}
                  onUploadingChange={form.setUploadingFor}
                  showIntro={false}
                />
                {form.orders.length > 0 && (
                  <OrderEvaluationFields
                    id="new-request"
                    evaluation={form.evaluation}
                    onChange={form.setEvaluation}
                    items={form.orders.flatMap((order) => order.items)}
                    categoryOptions={form.categories.options}
                    errors={localizeErrors(form.evaluationErrors, t)}
                    disabled={submitting}
                  />
                )}
              </div>
            )}

            {step.id === 'review' && (
              <div className="space-y-4">
                <AlertBanner message={t(form.error)} />
                <SectionCard title={t('Customer')} action={editButton(0)}>
                  <DescriptionList
                    items={[
                      { label: t('Full name'), value: formData.full_name },
                      {
                        label: t('Request type'),
                        value: t(requestTypeLabel(formData.request_type)),
                      },
                      { label: t('Email'), value: formData.email },
                      {
                        label: t('Phone number'),
                        value: formData.phone_local
                          ? `${formData.phone_dial_code} ${formData.phone_local}`
                          : '',
                      },
                    ]}
                  />
                </SectionCard>
                <SectionCard title={t('Pickup')} action={editButton(1)}>
                  <DescriptionList
                    items={[
                      {
                        label: t('Pickup date & time'),
                        value: formatPickupTime(
                          formData.requested_at,
                          locale === 'bm' ? 'ms-MY' : 'en-MY',
                        ),
                      },
                      {
                        label: t('Pickup address'),
                        value: formData.pickup_address,
                      },
                      { label: t('Note'), value: formData.note },
                    ]}
                  />
                </SectionCard>
                <SectionCard title={t('Orders')} action={editButton(2)}>
                  {form.orders.length ? (
                    <DescriptionList
                      items={form.orders.map((order, i) => ({
                        label: t('Order {number}', { number: i + 1 }),
                        value: `${
                          order.items
                            .map((item) =>
                              [
                                categoryLabel(item.category),
                                [item.estimated_quantity, item.quantity_unit]
                                  .filter(Boolean)
                                  .join(' '),
                              ]
                                .filter(Boolean)
                                .join(' · '),
                            )
                            .join(', ') || 'No materials'
                        } — ${order.photos.length} photo${order.photos.length === 1 ? '' : 's'}`,
                      }))}
                    />
                  ) : (
                    <p className="text-sm text-slate-500">
                      {t('No orders. You can add them later from the request.')}
                    </p>
                  )}
                </SectionCard>
                {form.orders.length > 0 && (
                  <SectionCard title={t('Evaluation')} action={editButton(2)}>
                    <p className="text-sm text-slate-700">
                      {evaluationSummary(form.evaluation, form.orders, t)}
                    </p>
                  </SectionCard>
                )}
              </div>
            )}
          </div>

          {/* Sticky footer: progress on one side, actions on the other. */}
          <div className="sticky bottom-0 z-10 flex flex-wrap items-center justify-between gap-3 rounded-b-2xl border-t border-slate-100 bg-white/95 px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur">
            <p className="text-sm text-slate-500" aria-live="polite">
              <span className="font-semibold text-neutral-950">
                {t('Step {step} of {total}', {
                  step: stepIndex + 1,
                  total: STEPS.length,
                })}
              </span>
              <span className="hidden sm:inline">
                {' '}
                · {t('{count} done', { count: form.completed.size })}
              </span>
            </p>
            <div className="flex w-full items-center gap-2 sm:w-auto">
              {stepIndex === 0 ? (
                <Button
                  href={basePath}
                  variant="secondary"
                  className="flex-1 sm:flex-none"
                >
                  {t('Cancel')}
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  onClick={form.back}
                  disabled={submitting}
                  className="flex-1 sm:flex-none"
                >
                  {t('Back')}
                </Button>
              )}
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 sm:flex-none"
              >
                {isLastStep &&
                  (submitting ? t('Creating…') : t('Create request'))}
                {!isLastStep && t('Continue')}
              </Button>
            </div>
          </div>
        </ValidatedForm>
      </Card>
    </PageContainer>
  );
};

export { PickupRequestCreateView };
