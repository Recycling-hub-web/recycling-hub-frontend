'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { LuMenu, LuX } from 'react-icons/lu';

import { useNotifications } from '../features/notifications/hooks';
import type { NavItem } from '../ui/navigation';
import { getActiveHref } from '../ui/navigation';
import { SidebarUserCard } from './SidebarUserCard';

type Props = {
  navItems: NavItem[];
};

// Priority order for the one role-specific "main work" tab — the first
// match wins, so this resolves to one sensible page per role: Pickup
// Requests for admin/staff/super-admin, Pickups for driver, Deliveries
// for receiving, Finance Records for accounting.
const MAIN_WORK_PATTERN = /\/(pickup-requests|pickups|deliveries|finance)$/;

/** The dashboard's mobile (<1024px) chrome: a 4-tab bottom bar — Home,
 * Notifications, one role-specific "main work" page, and Menu (opens
 * the "Your workspace" sheet listing every page) — plus that sheet
 * itself. Self-contained: owns its own open/close state, since nothing
 * outside it needs to open the sheet anymore (Topbar's old hamburger
 * is gone, replaced by this Menu tab). */
const SystemMobileNavigation = ({ navItems }: Props) => {
  const pathname = usePathname();
  const sheet = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const { count: unreadCount } = useNotifications();
  const pages = navItems.flatMap((item) =>
    item.children?.length
      ? item.children.map((child) => ({
          ...child,
          icon: child.icon ?? item.icon,
        }))
      : [item],
  );
  const home = pages[0];
  const notifications = pages.find((item) =>
    item.href.endsWith('/notifications'),
  );
  const mainWork = pages.find((item) => MAIN_WORK_PATTERN.test(item.href));
  const tabs = [
    ...(home ? [{ ...home, label: 'Home' }] : []),
    ...(notifications ? [{ ...notifications, label: 'Notifications' }] : []),
    ...(mainWork ? [mainWork] : []),
  ];
  const activeHref = getActiveHref(tabs, pathname);
  const menuActiveHref = getActiveHref(navItems, pathname);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!open) return undefined;
    sheet.current?.showModal();
    const desktop = window.matchMedia('(min-width: 1024px)');
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener('change', closeOnDesktop);
    return () => {
      sheet.current?.close();
      desktop.removeEventListener('change', closeOnDesktop);
    };
  }, [open]);

  return (
    <>
      <nav
        className="system-mobile-tabs lg:hidden"
        aria-label="Primary navigation"
      >
        {tabs.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            aria-current={activeHref === href ? 'page' : undefined}
          >
            <span className="relative">
              <Icon aria-hidden="true" />
              {label === 'Notifications' && unreadCount > 0 && (
                <span className="system-notification-dot absolute right-0 top-0 flex size-2 rounded-full bg-red-500" />
              )}
            </span>
            <span>{label}</span>
          </Link>
        ))}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-current={open ? 'page' : undefined}
        >
          <LuMenu aria-hidden="true" />
          <span>Menu</span>
        </button>
      </nav>
      <dialog
        ref={sheet}
        className="system-mobile-sheet"
        aria-labelledby="system-menu-title"
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === sheet.current) sheet.current?.close();
        }}
      >
        <div className="system-mobile-sheet-body" data-lenis-prevent>
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-200" />
          <div className="mb-4 flex items-center justify-between">
            <h2 id="system-menu-title" className="text-xl font-bold">
              Your workspace
            </h2>
            <button
              type="button"
              className="flex size-11 items-center justify-center rounded-full bg-slate-50"
              aria-label="Close menu"
              onClick={() => sheet.current?.close()}
            >
              <LuX size={22} />
            </button>
          </div>
          <nav aria-label="All sections" className="space-y-2">
            {pages.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => sheet.current?.close()}
                aria-current={menuActiveHref === href ? 'page' : undefined}
                className="flex min-h-12 items-center gap-3 rounded-xl bg-slate-50 px-4 text-sm font-medium text-slate-700"
              >
                <Icon size={20} />
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-4">
            <SidebarUserCard />
          </div>
        </div>
      </dialog>
    </>
  );
};
export { SystemMobileNavigation };
