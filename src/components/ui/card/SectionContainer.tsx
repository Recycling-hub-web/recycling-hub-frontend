import type { HTMLAttributes, ReactNode } from 'react';

type SectionContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

/** A bordered white box for one section of a page's content — padding
 * baked in (py-5 px-6), unlike Card, which leaves padding to the
 * caller. Meant to nest inside PageContainer, one per distinct block
 * of content (e.g. a chart panel), the same way Card nests inside
 * PageContainer for a single-block page like a form. */
const SectionContainer = ({
  children,
  className = '',
  ...rest
}: SectionContainerProps) => (
  <div
    className={`rounded-2xl border border-slate-100 bg-white px-6 py-5 ${className}`}
    {...rest}
  >
    {children}
  </div>
);

export { SectionContainer };
export type { SectionContainerProps };
