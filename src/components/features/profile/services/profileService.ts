import { apiFetch } from '../../../../lib/api';
import type { CurrentUser } from '../../../../types/auth';

/** The only fields the profile page edits. The backend's own-profile
 * endpoint always acts on the signed-in user (UserProfileView.get_object
 * returns request.user) — there's no user id in the URL to tamper with. */
type ProfileUpdate = {
  full_name: string;
  phone_number: string;
};

/** PATCH /accounts/me/ — returns the updated profile, same shape as
 * GET /accounts/me/ (CurrentUser). */
const updateMyProfile = (data: ProfileUpdate): Promise<CurrentUser> =>
  apiFetch('/accounts/me/', { method: 'PATCH', json: data });

export { updateMyProfile };
export type { ProfileUpdate };
