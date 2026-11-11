/** Bounds shared by form controls; domain-specific rules stay with each form. */
const TEXT_LIMITS: Record<string, number> = {
  full_name: 150,
  email: 254,
  website_url: 500,
  phone_number: 20,
  postcode: 5,
  bank_name: 120,
  account_holder_name: 150,
  bank_account_number: 34,
  bank_branch: 120,
  subject: 255,
  address: 1000,
  pickup_address: 1000,
  description: 10000,
  notes: 5000,
  reviewer_notes: 5000,
  message: 10000,
  cover_message: 10000,
  cancellation_reason: 5000,
  rejection_reason: 5000,
};

const fieldLimit = (field: string, multiline = false): number =>
  TEXT_LIMITS[field] ?? (multiline ? 10000 : 255);

const validateText = (
  value: string,
  required: boolean,
  maxLength?: number,
): string => {
  if (required && !value.trim()) return 'This field is required.';
  if (maxLength && value.length > maxLength)
    return `Use no more than ${maxLength} characters.`;
  // eslint-disable-next-line no-control-regex -- explicitly reject non-printing input characters
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value))
    return 'Remove unsupported control characters.';
  return '';
};

const validatePhoneText = (value: string): string => {
  if (!value.trim()) return '';
  const digits = value.replace(/[\s()+-]/g, '');
  return /^\+?[0-9\s()-]+$/.test(value) && /^[0-9]{7,15}$/.test(digits)
    ? ''
    : 'Enter a valid phone number with 7–15 digits and an optional country code.';
};

export { fieldLimit, validatePhoneText, validateText };
