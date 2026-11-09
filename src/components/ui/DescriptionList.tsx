import type { ReactNode } from 'react';

type DescriptionListItem = {
  label: string;
  /** Empty values (null, undefined, '') show the fallback instead. */
  value: ReactNode;
};

type DescriptionListProps = {
  items: DescriptionListItem[];
  /** Shown for an empty value. */
  fallback?: string;
  className?: string;
};

const isEmpty = (value: ReactNode) =>
  value === null || value === undefined || value === '';

/** Label/value pairs as a real <dl> — stacked on phones, two columns
 * from `sm`. For read-only summaries such as a step form's review step.
 * Unlike InfoRow (one icon tile per value, for detail pages) this is a
 * compact list. */
const DescriptionList = ({
  items,
  fallback = '—',
  className = '',
}: DescriptionListProps) => (
  <dl className={`divide-y divide-slate-100 ${className}`}>
    {items.map(({ label, value }) => (
      <div
        key={label}
        className="grid gap-1 py-2.5 first:pt-0 last:pb-0 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-4"
      >
        <dt className="text-sm text-slate-500">{label}</dt>
        <dd className="break-words text-sm font-medium text-neutral-950">
          {isEmpty(value) ? (
            <span className="font-normal text-slate-400">{fallback}</span>
          ) : (
            value
          )}
        </dd>
      </div>
    ))}
  </dl>
);

export { DescriptionList };
export type { DescriptionListItem, DescriptionListProps };
