'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LuX } from 'react-icons/lu';

import { ASSETS } from '../../constants/content';
import type { NavItem } from '../ui/navigation';
import {
  getActiveHref,
  SidebarNavGroup,
  SidebarNavLink,
} from '../ui/navigation';
import { SidebarUserCard } from './SidebarUserCard';

type SidebarProps = {
  navItems: NavItem[];
  /** Mobile drawer state — undefined/omitted means "always visible", the
   * static desktop behavior every layout already had. Layouts that want
   * the mobile slide-in drawer pass both. */
  open?: boolean;
  onClose?: () => void;
};

/** Reusable sidebar shell for every authenticated layout — each one just
 * supplies its own `navItems` (built from the shared module catalog in
 * layouts/navigation.ts), nothing here is role-specific. The header is a
 * fixed h-16 — the same height as Topbar — so the sidebar's bottom border
 * and the topbar's bottom border line up into one continuous rule across
 * the whole layout. Same logo lockup as Navbar/AuthCard: combined
 * wordmark+symbol from sm up, symbol mark alone below it.
 *
 * User identity + sign out live here (SidebarUserCard), not in Topbar —
 * one place, not two. */
/** Consecutive items sharing a `section` become one headed block; items
 * without one fall under a single "Menu" heading. */
const groupBySection = (items: NavItem[]) =>
  items.reduce<{ title: string; items: NavItem[] }[]>((blocks, item) => {
    const title = item.section ?? 'Menu';
    const last = blocks[blocks.length - 1];
    if (last && last.title === title) last.items.push(item);
    else blocks.push({ title, items: [item] });
    return blocks;
  }, []);

const Sidebar = ({ navItems, open, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const activeHref = getActiveHref(navItems, pathname);

  return (
    <>
      {/* Always rendered so it can fade with the drawer's slide. */}
      <div
        className={`fixed inset-0 z-40 bg-neutral-950/40 transition-opacity duration-300 ease-out motion-reduce:transition-none lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <nav
        className={`fixed inset-y-0 start-0 z-50 flex w-64 shrink-0 flex-col rounded-xl border border-slate-200 bg-white shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none lg:static lg:z-auto lg:w-60 lg:translate-x-0 ${
          // Plain -translate-x-full, not the ltr:/rtl: variant — those
          // need a [dir] attribute on an ancestor to ever match, and
          // nothing in this project ever sets one (EN/BM only, always
          // LTR), so the rtl:/ltr: form silently never applied and the
          // "closed" drawer sat fully visible at all times.
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 pe-3 ps-5 lg:justify-center">
          <Link href="/" className="flex items-center">
            <Image
              src={ASSETS.logo.combinedColor}
              alt="Recycling Hub"
              width={3100}
              height={700}
              className="hidden h-7 w-auto object-contain sm:block"
              priority
            />
            <Image
              src={ASSETS.logo.symbolColor}
              alt="Recycling Hub"
              width={560}
              height={565}
              className="size-7 object-contain sm:hidden"
              priority
            />
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 lg:hidden"
          >
            <LuX className="size-4" />
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto px-3 py-6">
          {groupBySection(navItems).map(({ title, items }, index) => (
            <div key={title} className={index > 0 ? 'mt-5' : ''}>
              <p className="mb-2 px-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {title}
              </p>
              <ul data-nav-section={title} className="flex flex-col gap-1">
                {items.map(({ children, ...item }) =>
                  children?.length ? (
                    <SidebarNavGroup
                      key={item.href}
                      label={item.label}
                      icon={item.icon}
                      items={children}
                      activeHref={activeHref}
                    />
                  ) : (
                    <SidebarNavLink
                      key={item.href}
                      {...item}
                      active={item.href === activeHref}
                    />
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>

        <SidebarUserCard />
      </nav>
    </>
  );
};

export { Sidebar };
export type { NavItem };
