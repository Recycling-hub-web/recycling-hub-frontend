import type { ReactNode } from 'react';

type StickyActionBarProps = {
  children: ReactNode;
  className?: string;
};

/** A page's main action(s), kept in reach on phones: below the `lg`
 * breakpoint it sticks to the bottom of the screen (above the tab bar,
 * clear of the iPhone safe area) with full-width buttons; from `lg` up it
 * sits in the page flow, right-aligned, like any other button row. The
 * one sticky-footer pattern for long pages — reuse it, don't rebuild it. */
const StickyActionBar = ({
  children,
  className = '',
}: StickyActionBarProps) => (
  <div
    className={`sticky bottom-0 z-10 -mx-4 mt-4 border-t border-slate-200 bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none ${className}`}
  >
    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end [&>*]:w-full sm:[&>*]:w-auto">
      {children}
    </div>
  </div>
);

export { StickyActionBar };
export type { StickyActionBarProps };
