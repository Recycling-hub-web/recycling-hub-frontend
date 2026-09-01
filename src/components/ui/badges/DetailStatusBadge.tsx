import type { ReactNode } from 'react';

import {
  type BadgeVariant,
  DOT_VARIANT_CLASSES,
  SOFT_VARIANT_CLASSES,
} from './variants';

type DetailStatusBadgeProps = {
  variant: BadgeVariant;
  children: ReactNode;
  className?: string;
};

const DetailStatusBadge = ({
  variant,
  children,
  className = '',
}: DetailStatusBadgeProps) => (
  <span
    className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-semibold ${SOFT_VARIANT_CLASSES[variant]} ${className}`}
  >
    <span
      className={`size-1.5 shrink-0 rounded-full ${DOT_VARIANT_CLASSES[variant]}`}
    />
    {children}
  </span>
);

export { DetailStatusBadge };
export type { DetailStatusBadgeProps };
