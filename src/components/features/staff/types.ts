import type { EmployeeProfile, UserDetail } from '../../../types/auth';

// GET /accounts/staff/ (StaffListSerializer) — a subset of
// EmployeeProfile; the list endpoint doesn't return joining_date/
// created_at/updated_at, only the detail endpoint does.
type StaffListItem = Omit<
  EmployeeProfile,
  'joining_date' | 'created_at' | 'updated_at'
> & {
  user: UserDetail;
};

// GET/PATCH /accounts/staff/<id>/ (StaffDetailSerializer) — the full
// EmployeeProfile shape, same one CurrentUser.profile already uses.
type StaffProfileDetail = EmployeeProfile & {
  user: UserDetail;
};

// POST /accounts/staff/ (StaffCreateSerializer) — a plain onboarding
// form, not a StaffProfile field subset: full_name/email/phone_number
// live on User, created together with the profile in one call.
type CreateStaffPayload = {
  full_name: string;
  email: string;
  phone_number?: string;
  department?: string;
  position?: string;
  branch?: string;
  joining_date?: string;
  // Unlike cover_image/Category.image elsewhere in this codebase, this
  // StorageFileField is declared `allow_null=True` on the backend (see
  // StaffCreateSerializer/StaffUpdateSerializer) — null is accepted to
  // clear it, no '' workaround needed here.
  profile_photo?: string | null;
};

// PATCH /accounts/staff/<id>/ (StaffUpdateSerializer) — only the
// StaffProfile-owned fields; full_name/email/phone_number live on User
// and aren't part of this serializer at all.
type UpdateStaffPayload = Partial<{
  department: string;
  position: string;
  branch: string;
  joining_date: string;
  profile_photo: string | null;
}>;

export type {
  CreateStaffPayload,
  StaffListItem,
  StaffProfileDetail,
  UpdateStaffPayload,
};
