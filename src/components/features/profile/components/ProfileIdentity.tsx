import type { CurrentUser } from '../../../../types/auth';
import { ROLE_LABELS } from '../../../../types/auth';
import { SolidBadge } from '../../../ui/badges/SolidBadge';

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?';

/** Avatar, name, email and role badge — the strip at the top of both
 * profile pages (view and edit). */
const ProfileIdentity = ({ user }: { user: CurrentUser }) => (
  <div className="mb-6 flex items-center gap-4 rounded-xl bg-slate-50 p-4">
    <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-100 text-lg font-bold text-brand-700">
      {user.profile_photo?.public_url ? (
        // eslint-disable-next-line @next/next/no-img-element -- remote/presigned URL, not a static asset
        <img
          src={user.profile_photo.public_url}
          alt={user.full_name}
          className="size-full object-cover"
        />
      ) : (
        getInitials(user.full_name)
      )}
    </div>
    <div className="min-w-0">
      <p className="truncate text-lg font-semibold text-neutral-950">
        {user.full_name}
      </p>
      <p className="truncate text-sm text-slate-500">{user.email}</p>
    </div>
    <SolidBadge variant="success" className="ms-auto">
      {ROLE_LABELS[user.role]}
    </SolidBadge>
  </div>
);

export { ProfileIdentity };
