'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LuLogOut } from 'react-icons/lu';

import { useAuth } from '../../contexts/AuthContext';
import { ROLE_LABELS } from '../../types/auth';

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?';

/** The signed-in user's avatar, name and role — a link to their own
 * profile (/profile) — plus Sign out, pinned to the bottom of the
 * Sidebar. Renders nothing while no user is loaded. */
const SidebarUserCard = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  if (!user) return null;

  // /profile and /profile/edit.
  const onProfile =
    pathname === '/profile' || Boolean(pathname?.startsWith('/profile/'));

  return (
    <div className="p-3">
      <div className="rounded-xl bg-slate-50 p-2.5">
        <Link
          href="/profile"
          aria-label={`${user.full_name} — view profile`}
          aria-current={onProfile ? 'page' : undefined}
          className="group flex items-center gap-3 rounded-lg p-0.5 transition-colors duration-200 hover:bg-white motion-reduce:transition-none"
        >
          <span
            className={`flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-100 text-xs font-bold text-brand-700 ring-2 transition-shadow duration-200 group-hover:ring-brand-200 motion-reduce:transition-none ${
              onProfile ? 'ring-brand-300' : 'ring-transparent'
            }`}
          >
            {user.profile_photo?.public_url ? (
              // eslint-disable-next-line @next/next/no-img-element -- remote/presigned URL, not a static asset
              <img
                src={user.profile_photo.public_url}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              getInitials(user.full_name)
            )}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-neutral-950">
              {user.full_name}
            </span>
            <span className="block truncate text-xs text-slate-400">
              {ROLE_LABELS[user.role]}
            </span>
          </span>
        </Link>
        <button
          type="button"
          onClick={logout}
          className="group mt-1.5 flex w-full items-center gap-3 rounded-lg p-2 text-start transition-colors duration-200 hover:bg-white hover:shadow-sm motion-reduce:transition-none"
        >
          <LuLogOut className="size-4 shrink-0 text-slate-400 transition-colors group-hover:text-red-600" />
          <span className="text-sm font-medium text-slate-500 transition-colors group-hover:text-red-600">
            Sign out
          </span>
        </button>
      </div>
    </div>
  );
};

export { SidebarUserCard };
