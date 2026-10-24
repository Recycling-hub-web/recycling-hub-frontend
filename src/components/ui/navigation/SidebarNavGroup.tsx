'use client';

import Link from 'next/link';
import { useEffect, useId, useState } from 'react';
import { LuChevronDown } from 'react-icons/lu';

import type { NavItem, NavSubItem } from './navItems';

type SidebarNavGroupProps = Omit<NavItem, 'href' | 'children'> & {
  items: NavSubItem[];
  /** The currently highlighted href (see getActiveHref). */
  activeHref: string | undefined;
};

/** A sidebar menu entry with sub-links — a disclosure button that expands
 * to show them, indented under a guide line. Opens on its own whenever
 * one of its sub-links is the current page; otherwise it's toggled by
 * the user. While one of its sub-links is active the group label takes
 * the brand color (without the full active background, which stays on
 * the sub-link itself). */
const SidebarNavGroup = ({
  label,
  icon: Icon,
  items,
  activeHref,
}: SidebarNavGroupProps) => {
  const hasActiveChild = items.some((item) => item.href === activeHref);
  const [open, setOpen] = useState(hasActiveChild);
  const listId = useId();

  // Navigating into one of the group's pages (e.g. from a button on
  // another page) opens it, even if the user had collapsed it earlier.
  useEffect(() => {
    if (hasActiveChild) setOpen(true);
  }, [hasActiveChild]);

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={listId}
        className={`flex w-full items-center gap-2.5 rounded-xl py-2.5 pe-3 ps-4 text-start text-sm font-medium transition-colors duration-200 hover:bg-slate-50 motion-reduce:transition-none ${
          hasActiveChild
            ? 'text-brand-700'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        <Icon className="size-4 shrink-0" />
        <span className="flex-1">{label}</span>
        <LuChevronDown
          className={`size-4 shrink-0 text-slate-400 transition-transform duration-300 ease-out motion-reduce:transition-none ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Always rendered so it can animate: the grid-rows 0fr↔1fr trick
          slides the height open/closed, and `invisible` (visibility,
          which only flips after the slide when closing) keeps collapsed
          links out of the tab order and the accessibility tree. */}
      <div
        className={`grid transition-[grid-template-rows,opacity,visibility] duration-300 ease-out motion-reduce:transition-none ${
          open
            ? 'visible grid-rows-[1fr] opacity-100'
            : 'invisible grid-rows-[0fr] opacity-0'
        }`}
      >
        {/* The clipping wrapper is what shrinks to 0 — the list's own
            margins sit inside it, so nothing is left behind when closed. */}
        <div className="min-h-0 overflow-hidden">
          <ul
            id={listId}
            className="my-1 ms-6 flex flex-col gap-0.5 border-s border-slate-200 ps-3"
          >
            {items.map(({ href, label: itemLabel }) => {
              const active = href === activeHref;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    className={`block rounded-lg px-3 py-2 text-sm transition-colors duration-200 motion-reduce:transition-none ${
                      active
                        ? 'bg-brand-50 font-semibold text-brand-700'
                        : 'font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {itemLabel}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </li>
  );
};

export { SidebarNavGroup };
