import type { ReactNode } from 'react';

type PageContainerVariant = 'table' | 'form';

const VARIANT_MAX_WIDTH: Record<PageContainerVariant, string> = {
  table: 'max-w-7xl',
  form: 'max-w-5xl',
};

type PageContainerProps = {
  variant?: PageContainerVariant;
  className?: string;
  children: ReactNode;
};

// No top margin here — every layout's <main> already carries its own
// vertical padding (e.g. AdminLayout's `py-8`); stacking this on top of
// that just doubled the gap above the page header. It was also never
// actually wired into any page until now — this component existed but no
// page rendered inside it.
const PageContainer = ({
  variant = 'form',
  className = '',
  children,
}: PageContainerProps) => (
  <div className={`mx-auto ${VARIANT_MAX_WIDTH[variant]} ${className}`}>
    {children}
  </div>
);

export { PageContainer };
export type { PageContainerProps, PageContainerVariant };
