import {
  joinPhoneNumber,
  validatePhoneNumber,
} from '../../../../constants/dialCodes';
import type { DraftOrder } from '../components/admin/NewOrdersFieldArray';
import { REQUEST_TYPE_FILTER_OPTIONS } from '../constants';
import type {
  CreateOrderPayload,
  PickupRequestCreatePayload,
} from '../services/pickupService';
import type { PickupRequestType } from '../types';
import { hasItemErrors, type UnitsByCategory, validateItems } from '../units';

/** The staff "New pickup request" step form — steps, form state, the
 * per-field rules and the payload builder. Pure: no React. The rules,
 * messages and payload are exactly those of the single-page form this
 * replaces. */

type StepId = 'customer' | 'pickup' | 'orders' | 'review';

type Step = { id: StepId; label: string; description: string };

const STEPS: Step[] = [
  {
    id: 'customer',
    label: 'Customer',
    description: 'Who the request is for and how to reach them.',
  },
  {
    id: 'pickup',
    label: 'Pickup',
    description: 'When and where to collect.',
  },
  {
    id: 'orders',
    label: 'Orders',
    description:
      'Optional. Add orders now, or later from the request. Each order needs its materials and at least one photo.',
  },
  {
    id: 'review',
    label: 'Review and submit',
    description: 'Check everything, then create the request.',
  },
];

type FormState = {
  full_name: string;
  email: string;
  phone_dial_code: string;
  phone_local: string;
  request_type: PickupRequestType;
  pickup_address: string;
  requested_at: string;
  note: string;
};

type FieldName = keyof FormState;

const INITIAL_STATE: FormState = {
  full_name: '',
  email: '',
  phone_dial_code: '+60',
  phone_local: '',
  request_type: 'individual',
  pickup_address: '',
  requested_at: '',
  note: '',
};

const REQUEST_TYPE_OPTIONS = REQUEST_TYPE_FILTER_OPTIONS.filter(
  (opt) => opt.value,
);

/** Which validated fields live on which step. Note has no rule. */
const STEP_FIELDS: Record<StepId, FieldName[]> = {
  customer: ['full_name', 'request_type', 'email', 'phone_local'],
  pickup: ['pickup_address'],
  orders: [],
  review: [],
};

/** One field's error ('' when fine) — the original form's rules. */
const validateField = (field: FieldName, data: FormState): string => {
  switch (field) {
    case 'full_name':
      return data.full_name.trim() ? '' : 'Full name is required.';
    case 'email':
      return data.request_type === 'business' && !data.email.trim()
        ? 'Email is required for business requests.'
        : '';
    case 'phone_local':
      return validatePhoneNumber(data.phone_dial_code, data.phone_local) ?? '';
    case 'pickup_address':
      return data.pickup_address.trim() ? '' : 'Pickup address is required.';
    default:
      return '';
  }
};

/** Errors for one step's fields, only the failing ones. */
const validateStepFields = (
  step: StepId,
  data: FormState,
): Partial<Record<FieldName, string>> => {
  const errors: Partial<Record<FieldName, string>> = {};
  STEP_FIELDS[step].forEach((field) => {
    const message = validateField(field, data);
    if (message) errors[field] = message;
  });
  return errors;
};

type OrderErrors = {
  itemErrors: Record<string, string>[][];
  photoErrors: string[];
  valid: boolean;
};

const validateOrders = (
  orders: DraftOrder[],
  unitsByCategory: UnitsByCategory,
): OrderErrors => {
  const itemErrors = orders.map((order) =>
    validateItems(order.items, unitsByCategory),
  );
  const photoErrors = orders.map((order) =>
    order.photos.length ? '' : 'Add at least one photo of the materials.',
  );
  return {
    itemErrors,
    photoErrors,
    valid: !itemErrors.some(hasItemErrors) && !photoErrors.some(Boolean),
  };
};

/** One draft order as the API takes it — shared by the create form's
 * `orders` and the edit page's add-order calls. */
const orderToPayload = (order: DraftOrder): CreateOrderPayload => ({
  items: order.items.map((item) => ({
    category: item.category,
    estimated_quantity: item.estimated_quantity?.trim() || undefined,
    quantity_unit: item.quantity_unit?.trim() || undefined,
  })),
  photos: order.photos.map((p) => p.file_key),
});

/** The POST body — field for field, key for key, the single-page form's
 * payload (keys left `undefined` are dropped when sent). */
const buildPayload = (
  data: FormState,
  orders: DraftOrder[],
): PickupRequestCreatePayload => ({
  full_name: data.full_name,
  email: data.email || undefined,
  phone_number: joinPhoneNumber(data.phone_dial_code, data.phone_local),
  request_type: data.request_type,
  pickup_address: data.pickup_address,
  requested_at: data.requested_at
    ? new Date(data.requested_at).toISOString()
    : undefined,
  note: data.note || undefined,
  orders: orders.length ? orders.map(orderToPayload) : undefined,
});

/** The success toast's body, unchanged. */
const successMessage = (data: FormState, orders: DraftOrder[]) =>
  orders.length
    ? `A request for ${data.full_name} has been added with ${orders.length} order${orders.length === 1 ? '' : 's'}.`
    : `A request for ${data.full_name} has been added.`;

const requestTypeLabel = (type: PickupRequestType) =>
  REQUEST_TYPE_OPTIONS.find((opt) => opt.value === type)?.label ?? type;

export {
  buildPayload,
  INITIAL_STATE,
  orderToPayload,
  REQUEST_TYPE_OPTIONS,
  requestTypeLabel,
  STEP_FIELDS,
  STEPS,
  successMessage,
  validateField,
  validateOrders,
  validateStepFields,
};
export type { FieldName, FormState, OrderErrors, Step, StepId };
