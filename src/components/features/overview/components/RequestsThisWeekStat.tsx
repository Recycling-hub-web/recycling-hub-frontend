'use client';

import { LuCalendarDays } from 'react-icons/lu';

import { StatCard } from '../../../ui/card/StatCard';
import { percentChange, type PickupWeekState } from '../hooks';

/** The solid stat a dashboard leads with: requests submitted this week,
 * its change vs last week, and the last 9 weeks as a mini trend. */
const RequestsThisWeekStat = ({
  href,
  week: { data, error, retry },
  className = '',
}: {
  href: string;
  /** From usePickupWeek — shared with PickupsThisWeekCard. */
  week: PickupWeekState;
  className?: string;
}) => {
  const change = data
    ? percentChange(data.thisWeekTotal, data.lastWeekTotal)
    : null;

  return (
    <StatCard
      variant="highlight"
      icon={<LuCalendarDays />}
      label="Requests this week"
      value={data ? data.thisWeekTotal.toLocaleString() : null}
      trend={
        change === null
          ? undefined
          : { value: change, comparison: 'vs last week' }
      }
      sparkline={
        data
          ? { values: data.recentWeeks, label: 'Requests, last 9 weeks' }
          : undefined
      }
      caption={data ? `${data.lastWeekTotal} last week` : undefined}
      href={href}
      error={error || undefined}
      onRetry={retry}
      className={className}
    />
  );
};

export { RequestsThisWeekStat };
