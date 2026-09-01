import type { ReactNode } from 'react';

import { type BadgeVariant, SOFT_VARIANT_CLASSES } from './variants';

type StatusBadgeProps = {
  variant: BadgeVariant;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

const StatusBadge = ({
  variant,
  icon,
  children,
  className = '',
}: StatusBadgeProps) => (
  <span
    className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium ${SOFT_VARIANT_CLASSES[variant]} ${className}`}
  >
    {icon}
    {children}
  </span>
);

export { StatusBadge };
export type { StatusBadgeProps };
