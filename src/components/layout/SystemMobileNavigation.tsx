'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { LuMenu, LuX } from 'react-icons/lu';

import { ASSETS, LOGO_SIZE } from '../../constants/content';
import { usePortalLocale } from '../../contexts/PortalLocaleContext';
import { useNotifications } from '../features/notifications/hooks';
import { BetaBadge } from '../ui/badges/BetaBadge';
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

/** Role-specific bottom navigation with a grouped, modal sidebar on mobile. */
const SystemMobileNavigation = ({ navItems }: Props) => {
  const pathname = usePathname();
  const { t } = usePortalLocale();
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
  // Home only lights up on the home page itself — its href (/admin, …)
  // is a prefix of every page in the section, so prefix-matching it would
  // keep Home lit everywhere. Any page that isn't one of the tabs was
  // reached through the mobile sidebar, so Menu lights up instead.
  const activeHref =
    getActiveHref(
      tabs.filter((tab) => tab.href !== home?.href),
      pathname,
    ) ?? (pathname === home?.href ? home.href : undefined);
  const menuActive = open || !activeHref;
  const menuActiveHref = getActiveHref(navItems, pathname);
  const groups = navItems.reduce<{ title: string; items: typeof pages }[]>(
    (result, item) => {
      const title = item.section ?? 'Menu';
      let group = result[result.length - 1];
      if (!group || group.title !== title) {
        group = { title, items: [] };
        result.push(group);
      }
      group.items.push(
        ...(item.children?.length
          ? item.children.map((child) => ({
              ...child,
              icon: child.icon ?? item.icon,
            }))
          : [item]),
      );
      return result;
    },
    [],
  );

  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!open) return undefined;
    const dialog = sheet.current;
    dialog?.showModal();
    const desktop = window.matchMedia('(min-width: 992px)');
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener('change', closeOnDesktop);
    return () => {
      dialog?.close();
      desktop.removeEventListener('change', closeOnDesktop);
    };
  }, [open]);

  return (
    <>
      <nav
        className="system-mobile-tabs lg:hidden"
        aria-label={t('Primary navigation')}
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
            <span>{t(label)}</span>
          </Link>
        ))}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-current={menuActive ? 'page' : undefined}
          aria-expanded={open}
          aria-controls="system-mobile-sidebar"
          aria-haspopup="dialog"
        >
          <LuMenu aria-hidden="true" />
          <span>{t('Menu')}</span>
        </button>
      </nav>
      <dialog
        ref={sheet}
        id="system-mobile-sidebar"
        className="system-mobile-sidebar"
        aria-labelledby="system-menu-title"
        onClose={() => setOpen(false)}
        onClick={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          if (
            event.target === event.currentTarget &&
            (event.clientX < rect.left ||
              event.clientX > rect.right ||
              event.clientY < rect.top ||
              event.clientY > rect.bottom)
          )
            event.currentTarget.close();
        }}
      >
        <header className="flex min-h-16 shrink-0 items-center justify-between gap-2 border-b border-slate-200 px-4">
          <Link
            href="/dashboard"
            onClick={() => sheet.current?.close()}
            className="flex items-center gap-2"
          >
            <Image
              src={ASSETS.logo.combinedColor}
              alt="Recycling Hub"
              width={LOGO_SIZE.horizontal.width}
              height={LOGO_SIZE.horizontal.height}
              className="h-6 w-auto"
            />
            <BetaBadge />
          </Link>
          <h2 id="system-menu-title" className="sr-only">
            Navigation menu
          </h2>
          <button
            type="button"
            className="flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-slate-50"
            aria-label="Close menu"
            onClick={() => sheet.current?.close()}
          >
            <LuX size={22} />
          </button>
        </header>
        <div className="system-mobile-sidebar-body" data-lenis-prevent>
          <nav aria-label="All sections" className="flex-1 space-y-5">
            {groups.map((group) => (
              <section key={group.title}>
                <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
                  {t(group.title)}
                </h3>
                <ul className="space-y-1">
                  {group.items.map(({ href, label, icon: Icon }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={() => sheet.current?.close()}
                        aria-current={
                          menuActiveHref === href ? 'page' : undefined
                        }
                        className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        <Icon size={20} aria-hidden="true" />
                        {t(label)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </nav>
          <div className="mt-5 border-t border-slate-100 pt-4">
            <SidebarUserCard />
          </div>
        </div>
      </dialog>
    </>
  );
};
export { SystemMobileNavigation };
