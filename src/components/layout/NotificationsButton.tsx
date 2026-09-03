'use client';

import { LuBell } from 'react-icons/lu';

import { Dropdown } from '../ui/dropdown/Dropdown';
import { EmptyState } from '../ui/empty/EmptyState';

// No notification system exists on the backend yet — this is a real,
// working dropdown shell (not a static decoration), just with nothing to
// show. Swap the EmptyState body for a real list once there's data to
// back it; don't fake a count badge or sample items in the meantime.
const NotificationsButton = () => (
  <Dropdown
    panelClassName="top-12 end-0 w-80 rounded-2xl border border-slate-200 bg-white shadow-lg"
    button={
      <button
        type="button"
        aria-label="Notifications"
        className="flex size-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
      >
        <LuBell className="size-5" />
      </button>
    }
  >
    <div className="border-b border-slate-100 px-4 py-3">
      <p className="text-sm font-semibold text-slate-900">Notifications</p>
    </div>
    <EmptyState
      icon={<LuBell className="size-6" />}
      title="No notifications yet"
      description="You're all caught up — new activity will show up here."
    />
  </Dropdown>
);

export { NotificationsButton };
