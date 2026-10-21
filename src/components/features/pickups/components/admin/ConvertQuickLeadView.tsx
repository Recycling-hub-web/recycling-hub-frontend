'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { LuArrowLeft, LuCircleCheck, LuCircleX, LuClock } from 'react-icons/lu';

import {
  joinPhoneNumber,
  splitPhoneNumber,
  validatePhoneNumber,
} from '../../../../../constants/dialCodes';
import type { SelectedAddress } from '../../../../../lib/geoapify';
import { AddressInput } from '../../../../form/fields/AddressInput';
import { InputField } from '../../../../form/fields/InputField';
import { PhoneInputField } from '../../../../form/fields/PhoneInputField';
import { SelectField } from '../../../../form/fields/SelectField';
import { TextareaField } from '../../../../form/fields/TextareaField';
import { PageContainer } from '../../../../layout/PageContainer';
import { AlertBanner } from '../../../../ui/AlertBanner';
import { Button } from '../../../../ui/buttons/Button';
import { FormActions } from '../../../../ui/buttons/FormActions';
import type { SegmentedOption } from '../../../../ui/buttons/SegmentedControl';
import { SegmentedControl } from '../../../../ui/buttons/SegmentedControl';
import { Card } from '../../../../ui/card/Card';
import { Loading } from '../../../../ui/loading/Loading';
import { PageHeader } from '../../../../ui/PageHeader';
import { useToast } from '../../../../ui/toast/ToastContext';
import { REQUEST_TYPE_FILTER_OPTIONS } from '../../constants';
import {
  useConvertQuickPickupRequest,
  useEvaluatePickup,
  usePickupCategories,
  useQuickPickupRequest,
} from '../../hooks';
import type { PickupRequestItemInput } from '../../services/pickupService';
import type { PickupRequestItem, PickupRequestType } from '../../types';
import { PickupItemsFieldArray } from '../shared/PickupItemsFieldArray';
import { isValidPrice, PricingEditor } from '../shared/PricingEditor';

const EMPTY_ITEM: PickupRequestItemInput = {
  category: '',
  estimated_quantity: '',
  quantity_unit: '',
};

type FormState = {
  full_name: string;
  email: string;
  // Split for PhoneInputField's own dialCodeField/numberField contract —
  // joined back into the single `phone_number` string the backend
  // actually stores only at submit time (see joinPhoneNumber).
  phone_dial_code: string;
  phone_local: string;
  request_type: PickupRequestType;
  pickup_address: string;
  requested_at: string;
  note: string;
  // Optional — evaluating right here skips the separate Evaluate step
  // on the details page afterward. 'none' = evaluate later.
  evaluation_decision: 'none' | 'approved' | 'rejected';
  evaluation_price: string;
  evaluation_reason: string;
};

const INITIAL_STATE: FormState = {
  full_name: '',
  email: '',
  phone_dial_code: '+60',
  phone_local: '',
  request_type: 'individual',
  pickup_address: '',
  requested_at: '',
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

const EVALUATE_NOW_OPTIONS: SegmentedOption<
  FormState['evaluation_decision']
>[] = [
  { value: 'none', label: 'Not yet', icon: LuClock },
  {
    value: 'approved',
    label: 'Approve',
    icon: LuCircleCheck,
    activeClassName: 'text-brand-600',
  },
  {
    value: 'rejected',
    label: 'Reject',
    icon: LuCircleX,
    activeClassName: 'text-red-600',
  },
];

/** Pairs each form line's price with the item the backend created for
 * it. The items are bulk-created, so their response order isn't
 * guaranteed — they're matched by material (and quantity, to tell apart
 * two lines of the same material) instead of by position. Returns null
 * if any line can't be matched. */
const matchItemPrices = (
  formItems: PickupRequestItemInput[],
  prices: string[],
  created: PickupRequestItem[],
): { item_id: string; price: string }[] | null => {
  const unused = [...created];
  const result: { item_id: string; price: string }[] = [];
  for (let i = 0; i < formItems.length; i += 1) {
    const line = formItems[i]!;
    const sameMaterial = unused.filter((c) => c.category.id === line.category);
    const quantity = line.estimated_quantity?.trim();
    const match =
      sameMaterial.find(
        (c) =>
          quantity &&
          c.estimated_quantity !== null &&
          Number(c.estimated_quantity) === Number(quantity),
      ) ?? sameMaterial[0];
    if (!match) return null;
    unused.splice(unused.indexOf(match), 1);
    result.push({ item_id: match.id, price: prices[i] ?? '' });
  }
  return result;
};

type ConvertQuickLeadViewProps = {
  /** This view's Orders basePath (e.g. /admin/pickups) — the new Order
   * is redirected to `${basePath}/{id}` once created. */
  basePath: '/admin/pickups' | '/staff/pickups' | '/super-admin/pickups';
};

// Completes a Quick Lead (QuickLeadTable's "Follow up" action) into a
// real pickup request AND one Order under it, in a single step — see
// PickupQuickRequestViewSet.convert on the backend. This used to also
// serve a plain "New request" create with no leadId; that's now a
// two-step flow (create a bare PickupRequest, then an Order under it —
// see PickupRequestCreateView/CreateOrderView), so this view only
// renders anything useful once reached with a `leadId`.
const ConvertQuickLeadView = ({ basePath }: ConvertQuickLeadViewProps) => {
  const router = useRouter();
  const toast = useToast();
  const searchParams = useSearchParams();
  const leadId = searchParams?.get('leadId') ?? null;

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
  const [items, setItems] = useState<PickupRequestItemInput[]>([
    { ...EMPTY_ITEM },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [itemErrors, setItemErrors] = useState<Record<string, string>[]>([]);
  const [pricingMode, setPricingMode] = useState<'lump' | 'itemized'>('lump');
  // One price per materials line, by index — kept as long as `items`.
  const [itemPrices, setItemPrices] = useState<string[]>([]);
  // Only ever displayed, not submitted — pickup_address stays a plain
  // string on this form/backend; this is AddressInput's richer object,
  // kept around purely to show the verified coordinates it found.
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedAddress | null>(null);

  const canItemize = items.length > 1;
  const itemized =
    formData.evaluation_decision === 'approved' &&
    canItemize &&
    pricingMode === 'itemized';
  const prices = items.map((_, i) => itemPrices[i] ?? '');

  const submitting = converting;
  const error = convertError;

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
    const phoneError = validatePhoneNumber(
      data.phone_dial_code,
      data.phone_local,
    );
    if (phoneError) nextErrors.phone_local = phoneError;
    if (!data.pickup_address.trim())
      nextErrors.pickup_address = 'Pickup address is required.';
    if (!data.requested_at)
      nextErrors.requested_at = 'Pickup date and time is required.';
    if (data.evaluation_decision === 'approved') {
      if (itemized) {
        if (!prices.every(isValidPrice)) {
          nextErrors.evaluation_price = 'Enter a valid price for every item.';
        }
      } else if (!isValidPrice(data.evaluation_price)) {
        nextErrors.evaluation_price = 'Enter a valid price.';
      }
    } else if (
      data.evaluation_decision === 'rejected' &&
      !data.evaluation_reason.trim()
    ) {
      nextErrors.evaluation_reason = 'A reason is required when rejecting.';
    }
    setErrors(nextErrors);

    const nextItemErrors: Record<string, string>[] = items.map(
      (item): Record<string, string> =>
        item.category ? {} : { category: 'Category is required.' },
    );
    setItemErrors(nextItemErrors);

    return (
      Object.keys(nextErrors).length === 0 &&
      nextItemErrors.every((e) => Object.keys(e).length === 0)
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!leadId) return;
    if (!validate(formData)) return;

    const payload = {
      full_name: formData.full_name,
      email: formData.email || undefined,
      phone_number: joinPhoneNumber(
        formData.phone_dial_code,
        formData.phone_local,
      ),
      request_type: formData.request_type,
      pickup_address: formData.pickup_address,
      requested_at: new Date(formData.requested_at).toISOString(),
      note: formData.note || undefined,
      items: items.map((item) => ({
        category: item.category,
        estimated_quantity: item.estimated_quantity?.trim() || undefined,
        quantity_unit: item.quantity_unit?.trim() || undefined,
      })),
    };

    try {
      const order = await convertLead(leadId, payload);

      if (formData.evaluation_decision !== 'none') {
        try {
          const pricedItems = itemized
            ? matchItemPrices(items, prices, order.items ?? [])
            : null;
          if (itemized && !pricedItems) {
            throw new Error('Could not match item prices to the order.');
          }
          await evaluateRequest(order.id, {
            decision: formData.evaluation_decision,
            price:
              formData.evaluation_decision === 'approved' && !itemized
                ? formData.evaluation_price
                : undefined,
            items: pricedItems ?? undefined,
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
          // The request/order itself was created fine — only the
          // follow-up evaluate call failed — so this isn't the generic
          // failure toast; it's created, just needs evaluating
          // manually now.
          toast.error(
            'Request created, but evaluation failed',
            'Open the order and evaluate it from there.',
          );
        }
      } else {
        toast.success(
          'Pickup request created',
          `A request for ${formData.full_name} has been added.`,
        );
      }
      router.push(`${basePath}/${order.id}`);
    } catch {
      // useConvertQuickPickupRequest already captured the message in
      // `error`, shown below.
    }
  };

  if (!leadId) {
    return (
      <PageContainer variant="form">
        <Link
          href={basePath}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
        >
          <LuArrowLeft className="size-4" />
          Back to orders
        </Link>
        <Card className="p-5 text-sm text-slate-600">
          This form follows up on a Quick Lead. To create a brand-new pickup
          request, use the{' '}
          <Link href={basePath} className="font-semibold text-brand-600">
            Pickup Requests
          </Link>{' '}
          list&apos;s &ldquo;New request&rdquo; action instead.
        </Card>
      </PageContainer>
    );
  }

  if (loadingLead) return <Loading text="Loading lead…" />;

  return (
    <PageContainer variant="form">
      <Link
        href={basePath}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <LuArrowLeft className="size-4" />
        Back to orders
      </Link>

      <PageHeader
        title="Follow up on quick lead"
        subtitle="Complete the rest of the details to create the real pickup request."
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
              label="Request type"
              field="request_type"
              options={REQUEST_TYPE_OPTIONS}
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <div className="sm:col-span-2">
              <AddressInput
                label="Pickup address"
                field="pickup_address"
                placeholder="Address where materials should be collected"
                formData={formData}
                errors={errors}
                updateFormData={updateFormData}
                disabled={submitting}
                countryRestrictions={['my']}
                onSelect={setSelectedLocation}
                onClear={() => setSelectedLocation(null)}
              />
              {selectedLocation && (
                <p className="-mt-3 mb-4 text-xs text-slate-400">
                  Verified at {selectedLocation.latitude.toFixed(5)},{' '}
                  {selectedLocation.longitude.toFixed(5)}
                </p>
              )}
            </div>
            <InputField
              label="Pickup date & time"
              field="requested_at"
              type="datetime-local"
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <PickupItemsFieldArray
              items={items}
              onChange={setItems}
              categoryOptions={categoryOptions}
              loadingCategories={loadingCategories}
              disabled={submitting}
              errors={itemErrors}
              labels={{
                itemsSection: 'Materials',
                category: 'Material category',
                estimatedQuantity: 'Estimated quantity',
                estimatedQuantityPlaceholder: 'e.g. 5',
                quantityUnit: 'Quantity unit',
                quantityUnitPlaceholder: 'e.g. kg',
                addItem: 'Add another item',
                removeItem: 'Remove',
                itemHeading: 'Item',
              }}
            />
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

          <section
            aria-labelledby="evaluate-now-heading"
            className="mt-1 rounded-xl border border-slate-200 bg-slate-50/60 p-4"
          >
            <h3
              id="evaluate-now-heading"
              className="text-sm font-semibold text-neutral-950"
            >
              Evaluation{' '}
              <span className="font-normal text-slate-400">(optional)</span>
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Already know the outcome? Decide it now and skip the Evaluate step
              on the order&apos;s details page.
            </p>

            <SegmentedControl
              ariaLabel="Evaluation decision"
              options={EVALUATE_NOW_OPTIONS}
              value={formData.evaluation_decision}
              onChange={(value) => updateFormData('evaluation_decision', value)}
              disabled={submitting}
              fullWidth
              className="mt-3"
            />

            {formData.evaluation_decision === 'approved' && (
              <div className="mt-4">
                <PricingEditor
                  lines={items.map((item, i) => {
                    const quantity = item.estimated_quantity?.trim();
                    return {
                      key: String(i),
                      label:
                        categoryOptions.find((o) => o.value === item.category)
                          ?.label ?? `Item ${i + 1}`,
                      detail: quantity
                        ? `${quantity} ${item.quantity_unit?.trim() || 'kg'}`
                        : undefined,
                      dataField: `item-price-${i}`,
                    };
                  })}
                  itemized={pricingMode === 'itemized'}
                  onItemizedChange={(on) => {
                    setPricingMode(on ? 'itemized' : 'lump');
                    setErrors((prev) => ({ ...prev, evaluation_price: '' }));
                  }}
                  total={formData.evaluation_price}
                  onTotalChange={(value) =>
                    updateFormData('evaluation_price', value)
                  }
                  totalDataField="evaluation_price"
                  prices={Object.fromEntries(
                    prices.map((value, i) => [String(i), value]),
                  )}
                  onPriceChange={(key, value) => {
                    const next = [...prices];
                    next[Number(key)] = value;
                    setItemPrices(next);
                    setErrors((prev) => ({ ...prev, evaluation_price: '' }));
                  }}
                  error={errors.evaluation_price}
                  disabled={submitting}
                />
              </div>
            )}
            {formData.evaluation_decision === 'rejected' && (
              <div className="mt-4">
                <TextareaField
                  label="Reason"
                  field="evaluation_reason"
                  placeholder="Why this request is being rejected"
                  formData={formData}
                  errors={errors}
                  updateFormData={updateFormData}
                  disabled={submitting}
                />
              </div>
            )}
          </section>

          <FormActions className="pt-5">
            <Button href={basePath} variant="secondary">
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Creating…' : 'Create request'}
            </Button>
          </FormActions>
        </form>
      </Card>
    </PageContainer>
  );
};

export { ConvertQuickLeadView };
