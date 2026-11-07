import { LuArrowDownRight, LuArrowUpRight, LuMinus } from 'react-icons/lu';

type TrendBadgeProps = {
  /** Signed change, e.g. 12 for +12%, -1.2 for −1.2 days. */
  value: number;
  /** Whether a rise is good news (most counts) or bad (days waiting,
   * cancellations). Colors follow good/bad, not up/down. */
  goodWhen?: 'up' | 'down';
  /** Unit after the number: '%' (default), ' days', '' for a plain count. */
  unit?: string;
  /** What it's compared with, read by screen readers: "vs last week". */
  comparison?: string;
  /** On a solid brand card: one translucent dark pill instead of green/red. */
  onSolid?: boolean;
  className?: string;
};

const TONES = {
  good: 'border-brand-200 bg-brand-50 text-brand-700',
  bad: 'border-red-200 bg-red-50 text-red-700',
  flat: 'border-slate-200 bg-slate-100 text-slate-600',
};

const formatNumber = (n: number) =>
  Math.abs(n).toLocaleString('en-MY', { maximumFractionDigits: 1 });

/** A signed change with its direction arrow — "↗ +12%", "↘ −1.2 days",
 * "— 0%". The arrow and sign carry the direction, the color says whether
 * that's good, so it never relies on color alone. */
const TrendBadge = ({
  value,
  goodWhen = 'up',
  unit = '%',
  comparison,
  onSolid = false,
  className = '',
}: TrendBadgeProps) => {
  let direction: 'up' | 'down' | 'flat' = 'flat';
  if (value > 0) direction = 'up';
  else if (value < 0) direction = 'down';

  let tone: keyof typeof TONES = 'flat';
  if (direction !== 'flat') tone = direction === goodWhen ? 'good' : 'bad';

  const Icon = {
    up: LuArrowUpRight,
    down: LuArrowDownRight,
    flat: LuMinus,
  }[direction];
  const sign = { up: '+', down: '−', flat: '' }[direction];
  const text = `${sign}${formatNumber(value)}${unit}`;
  const spoken = `${{ up: 'Up', down: 'Down', flat: 'No change,' }[direction]} ${text}${comparison ? ` ${comparison}` : ''}`;

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${
        onSolid ? 'bg-black/20 border-transparent text-white' : TONES[tone]
      } ${className}`}
    >
      <Icon className="size-3.5 shrink-0" aria-hidden />
      <span aria-hidden>{text}</span>
      <span className="sr-only">{spoken}</span>
    </span>
  );
};

export { TrendBadge };
export type { TrendBadgeProps };
