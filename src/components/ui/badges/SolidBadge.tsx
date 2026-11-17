import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { type BadgeVariant, SOLID_VARIANT_CLASSES } from './variants';

type SolidBadgeProps = ComponentPropsWithoutRef<'span'> & {
  variant: BadgeVariant;
  children: ReactNode;
  className?: string;
};

const SolidBadge = ({
  variant,
  children,
  className = '',
  ...props
}: SolidBadgeProps) => (
  <span
    {...props}
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${SOLID_VARIANT_CLASSES[variant]} ${className}`}
  >
    {children}
  </span>
);

export { SolidBadge };
export type { SolidBadgeProps };
