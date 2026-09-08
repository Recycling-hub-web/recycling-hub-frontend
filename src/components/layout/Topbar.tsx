import { LuMenu } from 'react-icons/lu';

import { useAuth } from '../../contexts/AuthContext';
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

/** Reusable topbar for every sidebar layout. Full identity + sign out
 * still live in Sidebar, not duplicated here — this is just a compact
 * "who's signed in" indicator alongside the mobile menu trigger (hidden
 * at lg, where Sidebar is always visible) and notifications. */
const Topbar = ({ onMenuClick }: TopbarProps) => {
  const { user } = useAuth();

  return (
    <header className="flex h-16 shrink-0 items-center rounded-xl bg-white px-4 shadow-sm lg:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="flex size-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
      >
        <LuMenu className="size-5" />
      </button>
      <div className="ms-auto flex items-center gap-3">
        <NotificationsButton />
        {user && (
          <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-100 bg-slate-50 text-xs font-bold text-slate-600">
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
        )}
      </div>
    </header>
  );
};

export { Topbar };
