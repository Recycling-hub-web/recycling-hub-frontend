'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { LuSlidersHorizontal } from 'react-icons/lu';

type FilterToggleProps = {
  /** The filter controls themselves (FilterSelect, etc.) — always
   * visible on desktop (there's room); collapsed behind the toggle
   * button on mobile until it's clicked. */
  children: ReactNode;
  /** How many filters are currently applied — 0 means none. Shown as a
   * dot on the mobile toggle button only — on desktop the filters
   * themselves are already visible, so there's nothing to badge. The
   * caller computes this, e.g.
   * `[statusFilter, typeFilter].filter(Boolean).length`. */
  activeCount?: number;
  /** Accessible label for the mobile toggle button — e.g. "filters" or
   * "sort options", so this one component covers either kind of
   * collapsible row, not just filters. */
  label?: string;
  className?: string;
};

/** On desktop there's always been room for the filter row next to the
 * search input, so it's just shown — no button, nothing to click. On
 * mobile it collapses behind a small icon button (filled with the
 * brand color so it's easy to spot on a crowded small screen, with a
 * plain dot when something's active) sitting right next to the search
 * input instead of taking its own row. The filter controls render
 * unconditionally either way — only their visibility classes change by
 * breakpoint — so nothing about the children's own state is lost by
 * toggling. */
const FilterToggle = ({
  children,
  activeCount = 0,
  label = 'filters',
  className = '',
}: FilterToggleProps) => {
  const [open, setOpen] = useState(false);
  const hasActiveFilters = activeCount > 0;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label={open ? `Hide ${label}` : `Show ${label}`}
        className={`relative inline-flex size-10 shrink-0 items-center justify-center rounded-full text-white transition-colors sm:hidden ${
          open ? 'bg-brand-800' : 'bg-brand-700 hover:bg-brand-800'
        } ${className}`}
      >
        <LuSlidersHorizontal className="size-4 shrink-0" />
        {hasActiveFilters && (
          <span className="absolute right-0 top-0 block size-2.5 rounded-full border-2 border-brand-700 bg-white" />
        )}
      </button>

      {/* Mobile: animates open/closed via a `grid-template-rows`
       * 0fr->1fr transition (display:none can't be transitioned, so
       * `hidden`/`flex` would otherwise snap instantly) — the standard
       * CSS-only technique for animating to/from an unknown content
       * height. Takes the full row's width so flex-wrap on the parent
       * pushes it onto its own new line below search + the toggle
       * button. Desktop: always expanded and fully opaque regardless
       * of `open`, auto width — sits inline with the search input,
       * same as before this toggle existed. */}
      <div
        className={`grid w-full transition-[grid-template-rows] duration-300 ease-out sm:w-auto sm:grid-rows-[1fr] ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div
          className={`flex min-h-0 flex-wrap gap-2 overflow-hidden transition-opacity duration-300 sm:opacity-100 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {children}
        </div>
      </div>
    </>
  );
};

export { FilterToggle };
export type { FilterToggleProps };
