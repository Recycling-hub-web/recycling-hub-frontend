import {
  joinPhoneNumber,
  validatePhoneNumber,
} from '../../../../constants/dialCodes';
import type { Dictionary } from '../../../../locales/en';
import type { OrderPhoto } from '../components/shared/PickupPhotosUploader';
import type { PickupRequestCreatePayload } from '../services/pickupService';

/** The public Business / Bulk pickup request as a step form — step ids,
 * form state, the per-field rules and the payload builder. Pure: no
 * React. Rules, messages and payload are exactly the single-page form's.
 * Step labels and copy live in the dictionary (EN + BM). */

type PublicStepId = 'details' | 'collect' | 'note' | 'review';

const PUBLIC_STEP_IDS: PublicStepId[] = [
  'details',
  'collect',
  'note',
  'review',
];

type PublicFormState = {
  full_name: string;
  email: string;
  phone_dial_code: string;
  phone_local: string;
  pickup_address: string;
  note: string;
};

/** Every field with a rule; `photos` isn't in the form state. */
type PublicFieldName =
  | 'full_name'
  | 'email'
  | 'phone_local'
  | 'pickup_address'
  | 'photos';

const PUBLIC_INITIAL_STATE: PublicFormState = {
  full_name: '',
  email: '',
  phone_dial_code: '+60',
  phone_local: '',
  pickup_address: '',
  note: '',
};

const PUBLIC_STEP_FIELDS: Record<PublicStepId, PublicFieldName[]> = {
  details: ['full_name', 'email', 'phone_local'],
  collect: ['pickup_address', 'photos'],
  note: [],
  review: [],
};

type FormCopy = Dictionary['pickupRequest']['form'];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** One field's error ('' when fine) — the original form's rules. */
const validatePublicField = (
  field: PublicFieldName,
  data: PublicFormState,
  photos: OrderPhoto[],
  copy: FormCopy,
): string => {
  switch (field) {
    case 'full_name':
      return data.full_name.trim() ? '' : copy.errorFullNameRequired;
    case 'email':
      if (!data.email.trim()) return copy.errorEmailRequired;
      return EMAIL_PATTERN.test(data.email) ? '' : copy.errorEmailInvalid;
    case 'phone_local':
      return (
        validatePhoneNumber(data.phone_dial_code, data.phone_local, {
          messages: {
            required: copy.errorPhoneRequired,
            invalid: copy.errorPhoneInvalid,
          },
        }) ?? ''
      );
    case 'pickup_address':
      return data.pickup_address.trim() ? '' : copy.errorAddressRequired;
    case 'photos':
      return photos.length ? '' : copy.errorPhotosRequired;
    default:
      return '';
  }
};

/** Errors for one step's fields, only the failing ones. */
const validatePublicStep = (
  step: PublicStepId,
  data: PublicFormState,
  photos: OrderPhoto[],
  copy: FormCopy,
): Partial<Record<PublicFieldName, string>> => {
  const errors: Partial<Record<PublicFieldName, string>> = {};
  PUBLIC_STEP_FIELDS[step].forEach((field) => {
    const message = validatePublicField(field, data, photos, copy);
    if (message) errors[field] = message;
  });
  return errors;
};

/** The POST body — key for key, the single-page form's (keys left
 * `undefined` are dropped when sent). Always a business request: the
 * public site has no individual option. */
const buildPublicPayload = (
  data: PublicFormState,
  photos: OrderPhoto[],
): PickupRequestCreatePayload => ({
  full_name: data.full_name.trim(),
  email: data.email.trim() || undefined,
  phone_number: joinPhoneNumber(data.phone_dial_code, data.phone_local.trim()),
  request_type: 'business',
  pickup_address: data.pickup_address.trim(),
  note: data.note.trim() || undefined,
  photos: photos.map((p) => p.file_key),
});

/** "Step 2 of 4" / "Langkah 2 daripada 4" from the dictionary template. */
const fillTemplate = (
  template: string,
  values: Record<string, string | number>,
) =>
  Object.entries(values).reduce(
    (text, [key, value]) => text.replace(`{${key}}`, String(value)),
    template,
  );

export {
  buildPublicPayload,
  fillTemplate,
  PUBLIC_INITIAL_STATE,
  PUBLIC_STEP_FIELDS,
  PUBLIC_STEP_IDS,
  validatePublicField,
  validatePublicStep,
};
export type { PublicFieldName, PublicFormState, PublicStepId };
