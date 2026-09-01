import type { ReactNode } from 'react';

import { type BadgeVariant, SOLID_VARIANT_CLASSES } from './variants';

type SolidBadgeProps = {
  variant: BadgeVariant;
  children: ReactNode;
  className?: string;
};

// Note: the pasted original was missing padding/shape/text-size classes
// entirely — it only applied the background color, so it rendered as an
// unstyled color box with no visible badge shape. Fixed to match the
// sibling badges' sizing.
const SolidBadge = ({ variant, children, className = '' }: SolidBadgeProps) => (
  <span
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${SOLID_VARIANT_CLASSES[variant]} ${className}`}
  >
    {children}
  </span>
);

export { SolidBadge };
export type { SolidBadgeProps };
