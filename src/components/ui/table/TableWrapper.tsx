'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

type TableWrapperProps = {
  children: ReactNode;
  footer?: ReactNode;
};

/** Scrollable table shell with fade affordances on either edge when the
 * table overflows horizontally, so a wide table never scrolls the page. */
const TableWrapper = ({ children, footer }: TableWrapperProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return undefined;

    const updateScrollState = () => {
      setCanScrollLeft(el.scrollLeft > 1);
      setCanScrollRight(el.scrollWidth - el.clientWidth - el.scrollLeft > 1);
    };

    // Carry column headings into the stacked mobile record cards.
    el.querySelectorAll('table').forEach((table) => {
      const headings = Array.from(
        table.querySelectorAll('thead tr:first-child th'),
      ).map((cell) => cell.textContent?.trim() ?? '');
      table.querySelectorAll('tbody tr').forEach((row) => {
        Array.from(row.children).forEach((cell, index) => {
          if (cell.tagName === 'TD' && !cell.hasAttribute('colspan')) {
            cell.setAttribute('data-column-label', headings[index] ?? '');
          }
        });
      });
    });
    updateScrollState();
    el.addEventListener('scroll', updateScrollState);
    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      resizeObserver.disconnect();
    };
  }, [children]);

  return (
    <div className="system-record-list overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="relative">
        <div ref={scrollRef} className="overflow-x-auto">
          {children}
        </div>
        {canScrollLeft && (
          <div className="pointer-events-none absolute inset-y-0 left-0 w-4 shadow-[inset_8px_0_8px_-8px_rgba(15,23,42,0.15)]" />
        )}
        {canScrollRight && (
          <div className="pointer-events-none absolute inset-y-0 right-0 w-4 shadow-[inset_-8px_0_8px_-8px_rgba(15,23,42,0.15)]" />
        )}
      </div>
      {footer}
    </div>
  );
};

export { TableWrapper };
export type { TableWrapperProps };
