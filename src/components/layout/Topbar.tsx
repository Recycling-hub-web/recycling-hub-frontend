import { LuMenu } from 'react-icons/lu';

type TopbarProps = {
  onMenuClick: () => void;
};

/** Reusable topbar for every sidebar layout. User identity + sign out live
 * in Sidebar now, not duplicated here — this is just the mobile menu
 * trigger (hidden at lg, where Sidebar is always visible) plus a slot for
 * page-level content (breadcrumbs, actions) as that gets built. */
const Topbar = ({ onMenuClick }: TopbarProps) => (
  <header className="flex h-16 shrink-0 items-center rounded-xl bg-white px-4 shadow-sm lg:px-6">
    <button
      type="button"
      onClick={onMenuClick}
      aria-label="Open menu"
      className="flex size-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
    >
      <LuMenu className="size-5" />
    </button>
  </header>
);

export { Topbar };
