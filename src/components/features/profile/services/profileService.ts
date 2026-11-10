import { apiFetch } from '../../../../lib/api';
import type { CurrentUser } from '../../../../types/auth';

/** The role details a user can change about themselves — every role but
 * Admin has these. Employee ID and the Arabic copies are managed by an
 * admin and aren't sent. */
type ProfileDetailsUpdate = {
  department?: string;
  position?: string;
  branch?: string;
  joining_date?: string | null;
  /** Drivers only. */
  payout_method?: string;
  payout_account_details?: string;
};

/** What the profile page edits. The backend's own-profile endpoint always
 * acts on the signed-in user (UserProfileView.get_object returns
 * request.user) — there's no user id in the URL to tamper with. Email
 * isn't here: it changes through the code flow below. */
type ProfileUpdate = {
  full_name: string;
  phone_number: string;
  whatsapp_enabled?: boolean;
  /** Storage key, or null to remove the photo. */
  profile_photo?: string | null;
  profile?: ProfileDetailsUpdate;
};

/** PATCH /accounts/me/ — returns the updated profile, same shape as
 * GET /accounts/me/ (CurrentUser). */
const updateMyProfile = (data: ProfileUpdate): Promise<CurrentUser> =>
  apiFetch('/accounts/me/', { method: 'PATCH', json: data });

/** POST /accounts/me/email/ — step 1 of changing your email: checks the
 * current password and sends a 6-digit code to the new address. Nothing
 * changes until confirmEmailChange. */
const requestEmailChange = (data: {
  new_email: string;
  current_password: string;
}): Promise<{ detail: string; new_email: string }> =>
  apiFetch('/accounts/me/email/', { method: 'POST', json: data });

/** POST /accounts/me/email/confirm/ — step 2: the code switches the
 * account's email (the old address gets a notice). Returns the updated
 * profile. */
const confirmEmailChange = (code: string): Promise<CurrentUser> =>
  apiFetch('/accounts/me/email/confirm/', {
    method: 'POST',
    json: { code },
  });

export { confirmEmailChange, requestEmailChange, updateMyProfile };
export type { ProfileDetailsUpdate, ProfileUpdate };
