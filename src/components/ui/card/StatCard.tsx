import Link from 'next/link';
import type { ReactNode } from 'react';
import { LuArrowUpRight, LuRefreshCw, LuTriangleAlert } from 'react-icons/lu';

import { TrendBadge, type TrendBadgeProps } from '../badges/TrendBadge';
import { Sparkbars } from '../charts/Sparkbars';
import { IconTile, type IconTileTone } from './IconTile';

type StatCardProps = {
  label: string;
  /** `null` while loading — a skeleton, not a real zero. */
  value: ReactNode | null;
  icon?: ReactNode;
  iconTone?: IconTileTone;
  /** Change vs a named period — the badge beside the value. */
  trend?: Omit<TrendBadgeProps, 'onSolid'>;
  /** One line under the value: "RM75,100 last month", "Lower is better". */
  caption?: string;
  /** Recent periods, oldest first — a mini bar trend under the value. */
  sparkline?: { values: number[]; label: string };
  /** The whole card links here, with an arrow in the corner. */
  href?: string;
  /** `highlight` is the one solid brand card a row leads with. */
  variant?: 'default' | 'highlight';
  error?: string;
  onRetry?: () => void;
  className?: string;
};

/** One KPI: label, a big value, and optionally its change, a caption and
 * a mini trend. Three states — ready, loading (`value` null) and error.
 * Presentational only; each page passes its own numbers in. */
const StatCard = ({
  label,
  value,
  icon,
  iconTone = 'brand',
  trend,
  caption,
  sparkline,
  href,
  variant = 'default',
  error,
  onRetry,
  className = '',
}: StatCardProps) => {
  const solid = variant === 'highlight';

  let body: ReactNode;
  if (error) {
    body = (
      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <LuTriangleAlert
          className={`size-4 ${solid ? 'text-white' : 'text-red-600'}`}
          aria-hidden
        />
        <span className={solid ? 'text-white/90' : 'text-slate-600'}>
          {error}
        </span>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
              solid
                ? 'bg-white/15 text-white hover:bg-white/25'
                : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <LuRefreshCw className="size-3.5" aria-hidden />
            Retry
          </button>
        )}
      </div>
    );
  } else if (value === null) {
    body = (
      <div aria-hidden className="mt-4 space-y-3">
        <div
          className={`h-9 w-24 animate-pulse rounded-lg ${solid ? 'bg-white/20' : 'bg-slate-100'}`}
        />
        <div
          className={`h-4 w-32 animate-pulse rounded ${solid ? 'bg-white/15' : 'bg-slate-100'}`}
        />
      </div>
    );
  } else {
    body = (
      <>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <p
            className={`text-3xl font-bold tracking-tight sm:text-4xl ${solid ? 'text-white' : 'text-neutral-950'}`}
          >
            {value}
          </p>
          {trend && <TrendBadge {...trend} onSolid={solid} />}
        </div>
        {sparkline && (
          <Sparkbars
            values={sparkline.values}
            label={sparkline.label}
            onSolid={solid}
            className="mt-4"
          />
        )}
        {caption && (
          <p
            className={`mt-3 text-sm ${solid ? 'text-white/85' : 'text-slate-500'}`}
          >
            {caption}
          </p>
        )}
      </>
    );
  }

  const card = (
    <>
      <div className="flex items-center gap-3">
        {icon && <IconTile icon={icon} tone={solid ? 'onSolid' : iconTone} />}
        <p
          className={`min-w-0 flex-1 text-sm font-medium ${solid ? 'text-white' : 'text-slate-600'}`}
        >
          {label}
        </p>
        {href && (
          <span
            aria-hidden
            className={`flex size-9 shrink-0 items-center justify-center rounded-full transition ${
              solid
                ? 'bg-white text-brand-700'
                : 'border border-slate-200 text-slate-500 group-hover:border-brand-300 group-hover:text-brand-700'
            }`}
          >
            <LuArrowUpRight className="size-4" />
          </span>
        )}
      </div>
      <div aria-busy={value === null && !error}>{body}</div>
    </>
  );

  let hover = '';
  if (href) hover = solid ? 'hover:bg-brand-800' : 'hover:border-brand-200';
  const cls = `group block rounded-2xl border p-5 transition ${
    solid ? 'border-brand-700 bg-brand-700' : 'border-slate-200 bg-white'
  } ${hover} ${className}`;

  return href ? (
    <Link href={href} className={cls}>
      {card}
    </Link>
  ) : (
    <div className={cls}>{card}</div>
  );
};

export { StatCard };
export type { StatCardProps };
