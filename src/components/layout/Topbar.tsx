import Image from 'next/image';
import Link from 'next/link';
import { LuChevronDown, LuUserRound } from 'react-icons/lu';

import { ASSETS } from '../../constants/content';
import { useAuth } from '../../contexts/AuthContext';
import { Dropdown } from '../ui/dropdown/Dropdown';
import { NotificationsButton } from './NotificationsButton';

// Same initials fallback as Sidebar's own account card — kept as a
// small local copy rather than a shared export, since the two avatars
// intentionally look different (Sidebar's is unbordered, brand-tinted;
// this one is bordered, neutral) and there's nothing else to share.
const getInitials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?';

/** Reusable topbar for every sidebar layout: notifications and the
 * signed-in user's avatar + name, which opens a small account menu
 * ("My Profile"). Full identity + sign out still live in Sidebar; the
 * mobile menu trigger lives in SystemMobileNavigation's "Menu" tab now,
 * not here. */
const Topbar = () => {
  const { user } = useAuth();

  return (
    <header className="system-app-header flex h-16 shrink-0 items-center bg-white px-4 shadow-sm lg:rounded-xl lg:px-6">
      <Link
        href="/dashboard"
        aria-label="Recycling Hub dashboard"
        className="mr-auto lg:hidden"
      >
        <Image
          src={ASSETS.logo.combinedColor}
          alt="Recycling Hub"
          width={3100}
          height={700}
          className="h-6 w-auto"
          priority
        />
      </Link>
      <div className="ms-auto flex items-center gap-1 lg:gap-3">
        <NotificationsButton />
        {user && (
          <Dropdown
            closeOnSelect
            panelClassName="absolute end-0 top-12 w-48"
            button={
              <button
                type="button"
                aria-label="Account menu"
                className="system-profile-trigger flex min-h-11 min-w-11 items-center gap-2 rounded-full p-0.5 pe-2 transition-colors hover:bg-slate-50"
              >
                <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-100 bg-slate-50 text-xs font-bold text-slate-600">
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
                <span className="hidden max-w-40 truncate text-sm font-medium text-slate-700 lg:block">
                  {user.full_name}
                </span>
                <LuChevronDown
                  className="hidden size-4 text-slate-400 lg:block"
                  aria-hidden="true"
                />
              </button>
            }
          >
            <div className="w-full rounded-xl border border-slate-100 bg-white p-1.5 shadow-lg">
              <Link
                href="/profile"
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                <LuUserRound className="size-4 text-slate-400" />
                My Profile
              </Link>
            </div>
          </Dropdown>
        )}
      </div>
    </header>
  );
};

export { Topbar };
