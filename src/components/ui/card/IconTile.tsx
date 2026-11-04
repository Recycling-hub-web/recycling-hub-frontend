import type { ReactNode } from 'react';

type IconTileTone =
  | 'brand'
  | 'info'
  | 'warning'
  | 'danger'
  | 'neutral'
  | 'onSolid';

const TONES: Record<IconTileTone, string> = {
  brand: 'bg-brand-50 text-brand-700',
  info: 'bg-blue-50 text-blue-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-red-50 text-red-700',
  neutral: 'bg-slate-100 text-slate-600',
  // On a solid brand card: a darker step of the same green.
  onSolid: 'bg-brand-900/60 text-white',
};

type IconTileProps = {
  icon: ReactNode;
  tone?: IconTileTone;
  size?: 'sm' | 'md';
  className?: string;
};

/** A soft square behind an icon — the leading mark on stat cards and
 * list rows. Decorative: the text beside it carries the meaning. */
const IconTile = ({
  icon,
  tone = 'brand',
  size = 'md',
  className = '',
}: IconTileProps) => (
  <span
    aria-hidden
    className={`flex shrink-0 items-center justify-center ${
      size === 'sm'
        ? 'size-9 rounded-lg text-base'
        : 'size-12 rounded-xl text-xl'
    } ${TONES[tone]} ${className}`}
  >
    {icon}
  </span>
);

export { IconTile };
export type { IconTileProps, IconTileTone };
