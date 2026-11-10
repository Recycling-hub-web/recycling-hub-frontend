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

    // Carry column headings into the stacked mobile record cards, and
    // give each cell its card role (see global.css .system-record-list):
    // the first data column is the card's title, a checkbox-only cell
    // the selector, a cell with an input a full-width field, and the
    // last "Actions" (or unlabelled) column the card's action row. A
    // table can set data-card-role on a cell itself to override this.
    const cleanups: (() => void)[] = [];
    el.querySelectorAll('table').forEach((table) => {
      const headings = Array.from(
        table.querySelectorAll('thead tr:first-child th'),
      ).map((cell) => cell.textContent?.trim() ?? '');
      table.querySelectorAll('tbody tr').forEach((row) => {
        const cells = Array.from(row.children).filter(
          (cell) => cell.tagName === 'TD' && !cell.hasAttribute('colspan'),
        ) as HTMLElement[];
        let titleSet = false;
        cells.forEach((cell) => {
          const index = Array.from(row.children).indexOf(cell);
          const heading = headings[index] ?? '';
          cell.setAttribute('data-column-label', heading);
          // Roles this effect gave out last time are worked out afresh
          // (the row may have changed); a role the table set itself stays.
          if (cell.hasAttribute('data-card-role-auto')) {
            cell.removeAttribute('data-card-role');
            cell.removeAttribute('data-card-role-auto');
          }
          if (cell.dataset.cardRole) {
            if (cell.dataset.cardRole === 'title') titleSet = true;
            return;
          }
          const checkbox = cell.querySelector('input[type="checkbox"]');
          const hasText = Boolean(cell.textContent?.trim());
          const isLast = index === row.children.length - 1;
          if (checkbox && !hasText) {
            cell.setAttribute('data-card-role', 'select');
            cell.setAttribute('data-card-role-auto', '');
            // The whole 44px cell toggles its checkbox, not just the box.
            const toggle = (e: Event) => {
              if (e.target !== checkbox) (checkbox as HTMLInputElement).click();
            };
            cell.addEventListener('click', toggle);
            cleanups.push(() => cell.removeEventListener('click', toggle));
          } else if (
            isLast &&
            (heading === '' || /^actions$/i.test(heading)) &&
            cell.querySelector('a, button')
          ) {
            cell.setAttribute('data-card-role', 'actions');
            cell.setAttribute('data-card-role-auto', '');
          } else if (
            cell.querySelector(
              'input:not([type="checkbox"]):not([type="hidden"]), select, textarea',
            )
          ) {
            cell.setAttribute('data-card-role', 'field');
            cell.setAttribute('data-card-role-auto', '');
          } else if (!titleSet) {
            cell.setAttribute('data-card-role', 'title');
            cell.setAttribute('data-card-role-auto', '');
            titleSet = true;
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
      cleanups.forEach((cleanup) => cleanup());
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
