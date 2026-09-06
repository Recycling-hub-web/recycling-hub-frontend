// Mirrors apps.authentication.models.OTPCode.PURPOSE on the backend —
// login is the only purpose that exists (there's no registration flow).
const OTP_PURPOSE = {
  LOGIN: 'login',
} as const;

type OtpPurpose = (typeof OTP_PURPOSE)[keyof typeof OTP_PURPOSE];

export { OTP_PURPOSE };
export type { OtpPurpose };
