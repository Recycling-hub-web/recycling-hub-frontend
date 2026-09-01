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

const PageContainer = ({
  variant = 'form',
  className = '',
  children,
}: PageContainerProps) => (
  <div className={`mx-auto mt-6 ${VARIANT_MAX_WIDTH[variant]} ${className}`}>
    {children}
  </div>
);

export { PageContainer };
export type { PageContainerProps, PageContainerVariant };
