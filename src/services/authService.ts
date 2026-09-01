import { apiFetch } from '../lib/api';
import type { CurrentUser } from '../types/auth';

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
    json: { email, code, purpose: 'login' },
    skipAuth: true,
  });

const resendLoginOtp = (
  email: string,
): Promise<{ detail: string; channel: string }> =>
  apiFetch('/auth/otp/resend/', {
    method: 'POST',
    json: { email, purpose: 'login' },
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
 * call sites (reset-password.tsx vs set-password.tsx) read clearly, even
 * though the request shape is identical. */
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

export {
  forgotPassword,
  getCurrentUser,
  login,
  logout,
  resendLoginOtp,
  resetPassword,
  setPassword,
  verifyLoginOtp,
};
