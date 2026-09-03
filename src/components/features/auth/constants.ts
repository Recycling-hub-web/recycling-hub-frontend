// Mirrors apps.authentication.models.OTPCode.PURPOSE on the backend — the
// only two purposes the frontend ever sends (registration has no UI yet,
// see resident-removal notes elsewhere in this codebase).
const OTP_PURPOSE = {
  LOGIN: 'login',
  REGISTER: 'register',
} as const;

type OtpPurpose = (typeof OTP_PURPOSE)[keyof typeof OTP_PURPOSE];

export { OTP_PURPOSE };
export type { OtpPurpose };
