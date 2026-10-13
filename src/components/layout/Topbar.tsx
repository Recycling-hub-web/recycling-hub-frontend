import Link from 'next/link';
import { LuChevronDown, LuMenu, LuUserRound } from 'react-icons/lu';

import { useAuth } from '../../contexts/AuthContext';
import { Dropdown } from '../ui/dropdown/Dropdown';
import { NotificationsButton } from './NotificationsButton';

type TopbarProps = {
  onMenuClick: () => void;
};

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

/** Reusable topbar for every sidebar layout: the mobile menu trigger
 * (hidden at lg, where Sidebar is always visible), notifications, and the
 * signed-in user's avatar + name, which opens a small account menu
 * ("My Profile"). Full identity + sign out still live in Sidebar. */
const Topbar = ({ onMenuClick }: TopbarProps) => {
  const { user } = useAuth();

  return (
    <header className="flex h-16 shrink-0 items-center rounded-xl bg-white px-4 shadow-sm lg:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 lg:hidden"
      >
        <LuMenu className="size-5" />
      </button>
      <div className="ms-auto flex items-center gap-3">
        <NotificationsButton />
        {user && (
          <Dropdown
            closeOnSelect
            panelClassName="absolute end-0 top-12 w-48"
            button={
              <button
                type="button"
                aria-label="Account menu"
                className="flex items-center gap-2 rounded-full p-0.5 pe-2 transition-colors hover:bg-slate-50"
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
                <span className="hidden max-w-40 truncate text-sm font-medium text-slate-700 sm:block">
                  {user.full_name}
                </span>
                <LuChevronDown
                  className="size-4 text-slate-400"
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
