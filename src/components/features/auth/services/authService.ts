import { apiFetch } from '../../../../lib/api';
import type { CurrentUser } from '../../../../types/auth';
import { OTP_PURPOSE } from '../constants';

// One-to-one with apps.authentication.urls on the backend — every route
// below is a real endpoint there (see apps/authentication/views.py):
// login/, logout/, otp/verify/, otp/resend/, password-forgot/,
// password-reset/, password-change/, token/refresh/ (handled transparently
// by apiFetch's own silent-retry, not called directly here).

type LoginResult =
  | { requiresOtp: true; channel: string }
  | { requiresOtp: false };

const login = async (email: string, password: string): Promise<LoginResult> => {
  const data = await apiFetch<
    | { requires_otp: true; detail: string; channel: string }
    | { requires_otp: false }
  >('/auth/login/', {
    method: 'POST',
    json: { email, password },
    skipAuth: true,
  });

  if (data.requires_otp) {
    return { requiresOtp: true, channel: data.channel };
  }
  return { requiresOtp: false };
};

const verifyLoginOtp = (email: string, code: string): Promise<void> =>
  apiFetch('/auth/otp/verify/', {
    method: 'POST',
    json: { email, code, purpose: OTP_PURPOSE.LOGIN },
    skipAuth: true,
  });

const resendLoginOtp = (
  email: string,
): Promise<{ detail: string; channel: string }> =>
  apiFetch('/auth/otp/resend/', {
    method: 'POST',
    json: { email, purpose: OTP_PURPOSE.LOGIN },
    skipAuth: true,
  });

// No skipAuth — an expired access cookie should trigger the normal
// refresh-and-retry in apiFetch so a returning visitor with a still-valid
// refresh cookie stays silently logged in.
const getCurrentUser = (): Promise<CurrentUser> => apiFetch('/accounts/me/');

const logout = (): Promise<void> =>
  apiFetch('/auth/logout/', { method: 'POST', skipAuth: true });

const forgotPassword = (email: string): Promise<{ detail: string }> =>
  apiFetch('/auth/password-forgot/', {
    method: 'POST',
    json: { email },
    skipAuth: true,
  });

/** Same backend endpoint as `setPassword` — kept as two named exports so
 * call sites (reset-password vs set-password) read clearly, even though
 * the request shape is identical. */
const resetPassword = (
  token: string,
  password: string,
): Promise<{ detail: string }> =>
  apiFetch('/auth/password-reset/', {
    method: 'POST',
    json: { token, password },
    skipAuth: true,
  });

const setPassword = (
  token: string,
  password: string,
): Promise<{ detail: string }> => resetPassword(token, password);

/** POST /auth/password-change/ — IsAuthenticated on the backend (the
 * account already has a password; this isn't the token-based reset flow
 * above), so no skipAuth here, same as getCurrentUser. Not called from any
 * screen yet — there's no "change password" UI built — kept ready for
 * when one is. */
const changePassword = (
  oldPassword: string,
  newPassword: string,
): Promise<{ message: string }> =>
  apiFetch('/auth/password-change/', {
    method: 'POST',
    json: { old_password: oldPassword, new_password: newPassword },
  });

export {
  changePassword,
  forgotPassword,
  getCurrentUser,
  login,
  logout,
  resendLoginOtp,
  resetPassword,
  setPassword,
  verifyLoginOtp,
};
export type { LoginResult };
