import type { ReactNode } from 'react';

type ChartCardStat = { label: string; value: ReactNode };

type ChartCardProps = {
  title: string;
  subtitle?: string;
  /** Round icon buttons/links in the top corner. */
  actions?: ReactNode;
  /** Totals under the chart, split by thin dividers. */
  stats?: ChartCardStat[];
  children: ReactNode;
  className?: string;
};

/** The frame for one chart on a dashboard: a title and subtitle, optional
 * corner actions, the chart, and a row of summary numbers underneath. */
const ChartCard = ({
  title,
  subtitle,
  actions,
  stats,
  children,
  className = '',
}: ChartCardProps) => (
  <section
    className={`flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white ${className}`}
  >
    <div className="flex items-start justify-between gap-3 px-6 pt-5">
      <div className="min-w-0">
        <h2 className="text-lg font-semibold text-neutral-950">{title}</h2>
        {subtitle && (
          <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </div>

    <div className="flex-1 px-6 pb-5 pt-6">{children}</div>

    {stats && stats.length > 0 && (
      <dl className="grid auto-cols-fr grid-flow-col divide-x divide-slate-200 border-t border-slate-200 py-4 rtl:divide-x-reverse">
        {stats.map((stat) => (
          <div key={stat.label} className="min-w-0 px-6">
            <dt className="truncate text-sm text-slate-500">{stat.label}</dt>
            <dd className="mt-1 text-2xl font-semibold text-neutral-950">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    )}
  </section>
);

export { ChartCard };
export type { ChartCardProps, ChartCardStat };
