import Link from 'next/link';
import type { IconType } from 'react-icons';

type OverviewStatCardProps = {
  icon: IconType;
  label: string;
  /** `null` renders a loading skeleton in place of the number — the
   * hook hasn't resolved yet, not a real zero. */
  value: number | null;
  /** Optional — when set, the whole tile is a link to that module. */
  href?: string;
};

const cardCls =
  'flex items-center gap-3.5 rounded-2xl border border-slate-100 bg-white p-4 transition-colors';

/** One KPI tile — plain presentational, no data fetching of its own.
 * Every Overview page (Admin/Staff today) composes a row of these from
 * its own stats hook. */
const OverviewStatCard = ({
  icon: Icon,
  label,
  value,
  href,
}: OverviewStatCardProps) => {
  const content = (
    <>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-slate-500">{label}</p>
        {value === null ? (
          <div className="mt-1 h-6 w-10 animate-pulse rounded bg-slate-100" />
        ) : (
          <p className="text-xl font-bold text-neutral-950">{value}</p>
        )}
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`${cardCls} hover:border-brand-200`}>
        {content}
      </Link>
    );
  }

  return <div className={cardCls}>{content}</div>;
};

export { OverviewStatCard };
