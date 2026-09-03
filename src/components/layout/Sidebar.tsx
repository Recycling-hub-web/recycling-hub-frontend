'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { IconType } from 'react-icons';
import { LuLogOut, LuX } from 'react-icons/lu';

import { ASSETS } from '../../constants/content';
import { useAuth } from '../../contexts/AuthContext';
import { ROLE_LABELS } from '../../types/auth';

type NavItem = {
  href: string;
  label: string;
  icon: IconType;
};

type SidebarProps = {
  navItems: NavItem[];
  /** Mobile drawer state — undefined/omitted means "always visible", the
   * static desktop behavior every layout already had. Layouts that want
   * the mobile slide-in drawer pass both. */
  open?: boolean;
  onClose?: () => void;
};

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?';

/** Reusable sidebar shell for every authenticated layout (Admin, and each
 * operational role's own layout) — each layout just supplies its own
 * `navItems`, nothing else here is role-specific. The header is a fixed
 * h-16 — the same height as Topbar — so the sidebar's bottom border and
 * the topbar's bottom border line up into one continuous rule across the
 * whole layout instead of two independently-drifting strips. Same logo
 * lockup as Navbar/AuthCard: combined wordmark+symbol from sm up, symbol
 * mark alone below it.
 *
 * User identity + sign out live here, not in Topbar — one place, not two. */
const Sidebar = ({ navItems, open, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-neutral-950/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <nav
        className={`fixed inset-y-0 start-0 z-50 flex h-screen w-64 shrink-0 flex-col rounded-xl border border-slate-200 bg-white shadow-sm transition-transform duration-200 ease-in-out lg:static lg:z-auto lg:w-60 lg:translate-x-0 ${
          // Plain -translate-x-full, not the ltr:/rtl: variant — those
          // need a [dir] attribute on an ancestor to ever match, and
          // nothing in this project ever sets one (EN/BM only, always
          // LTR), so the rtl:/ltr: form silently never applied and the
          // "closed" drawer sat fully visible at all times.
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 pe-3 ps-5">
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
            className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden"
          >
            <LuX className="size-4" />
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto px-3 py-6">
          <p className="mb-2 px-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Menu
          </p>
          <ul className="flex flex-col gap-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <li key={href} className="relative">
                  {active && (
                    <span
                      className="absolute inset-y-2 start-0 w-1 rounded-full bg-brand-600"
                      aria-hidden="true"
                    />
                  )}
                  <Link
                    href={href}
                    className={`flex items-center gap-2.5 rounded-xl py-2.5 pe-3 ps-4 text-sm font-medium transition-colors ${
                      active
                        ? 'bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-600/10'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="size-4 shrink-0" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {user && (
          <div className="p-3">
            <div className="rounded-xl bg-slate-50 p-2.5">
              <div className="flex items-center gap-3 p-0.5">
                <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                  {user.profile_photo?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element -- remote/presigned URL, not a static asset
                    <img
                      src={user.profile_photo.url}
                      alt={user.full_name}
                      className="size-full object-cover"
                    />
                  ) : (
                    getInitials(user.full_name)
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-neutral-950">
                    {user.full_name}
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    {ROLE_LABELS[user.role]}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={logout}
                className="group mt-1.5 flex w-full items-center gap-3 rounded-lg p-2 text-start transition-colors hover:bg-white hover:shadow-sm"
              >
                <LuLogOut className="size-4 shrink-0 text-slate-400 transition-colors group-hover:text-red-600" />
                <span className="text-sm font-medium text-slate-500 transition-colors group-hover:text-red-600">
                  Sign out
                </span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export { Sidebar };
export type { NavItem };
