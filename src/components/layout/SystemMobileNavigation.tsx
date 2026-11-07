'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { LuPlus, LuUserRound, LuX } from 'react-icons/lu';

import type { NavItem } from '../ui/navigation';
import { getActiveHref } from '../ui/navigation';
import { SidebarUserCard } from './SidebarUserCard';

type Props = {
  navItems: NavItem[];
  open: boolean;
  onClose: () => void;
};

const SystemMobileNavigation = ({ navItems, open, onClose }: Props) => {
  const pathname = usePathname();
  const sheet = useRef<HTMLDialogElement>(null);
  const pages = navItems.flatMap((item) =>
    item.children?.length
      ? item.children.map((child) => ({
          ...child,
          icon: child.icon ?? item.icon,
        }))
      : [item],
  );
  const home = pages[0];
  const requests = pages.find((item) => item.href.endsWith('/pickup-requests'));
  const work = pages.find((item) =>
    /\/(pickups|deliveries|finance)$/.test(item.href),
  );
  const secondary = pages.find((item) =>
    /\/(drop-off|claims|notifications)$/.test(item.href),
  );
  const tabs = [
    ...(home ? [{ ...home, label: 'Home' }] : []),
    ...(requests
      ? [
          {
            ...requests,
            href: `${requests.href}/create`,
            label: 'Book',
            icon: LuPlus,
          },
          { ...requests, label: 'Track' },
        ]
      : [work, secondary].filter((item): item is NonNullable<typeof item> =>
          Boolean(item),
        )),
    { href: '/profile', label: 'You', icon: LuUserRound },
  ];
  const activeHref = getActiveHref(tabs, pathname);
  const menuActiveHref = getActiveHref(navItems, pathname);

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);
  useEffect(() => {
    if (!open) return undefined;
    sheet.current?.showModal();
    const desktop = window.matchMedia('(min-width: 1024px)');
    const closeOnDesktop = () => {
      if (desktop.matches) onClose();
    };
    desktop.addEventListener('change', closeOnDesktop);
    return () => {
      sheet.current?.close();
      desktop.removeEventListener('change', closeOnDesktop);
    };
  }, [open, onClose]);

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
            <Icon aria-hidden="true" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
      <dialog
        ref={sheet}
        className="system-mobile-sheet"
        aria-labelledby="system-menu-title"
        onClose={onClose}
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
