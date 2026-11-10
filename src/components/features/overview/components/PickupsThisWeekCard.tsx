'use client';

import Link from 'next/link';
import { LuArrowUpRight, LuRefreshCw } from 'react-icons/lu';

import { TrendBadge } from '../../../ui/badges/TrendBadge';
import { ChartCard } from '../../../ui/card/ChartCard';
import { WeekBarChart } from '../../../ui/charts/WeekBarChart';
import { percentChange, type PickupWeekState } from '../hooks';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const roundButton =
  'flex size-11 items-center justify-center rounded-full border border-brand-600 lg:size-10 text-brand-700 transition hover:bg-brand-50';

/** Pickup requests submitted each day this week — today highlighted,
 * the rest of the week hatched — with this week, last week and the
 * change underneath. */
const PickupsThisWeekCard = ({
  requestsHref,
  week: { data, error, retry },
}: {
  requestsHref: string;
  /** From usePickupWeek — shared with RequestsThisWeekStat. */
  week: PickupWeekState;
}) => {
  const change = data
    ? percentChange(data.thisWeekTotal, data.lastWeekTotal)
    : null;
  const remaining = data ? 6 - data.todayIndex : 0;
  let subtitle = 'Loading…';
  if (data) {
    subtitle =
      remaining > 0
        ? `${remaining} day${remaining === 1 ? '' : 's'} still to come`
        : 'The week is complete';
  }

  return (
    <ChartCard
      title="Requests this week"
      subtitle={subtitle}
      actions={
        <Link
          href={requestsHref}
          aria-label="Open pickup requests"
          className={roundButton}
        >
          <LuArrowUpRight className="size-4" />
        </Link>
      }
      stats={
        data
          ? [
              { label: 'This week', value: data.thisWeekTotal },
              { label: 'Last week', value: data.lastWeekTotal },
              {
                label: 'Change',
                value:
                  change === null ? (
                    '—'
                  ) : (
                    <TrendBadge
                      value={change}
                      comparison="vs last week"
                      className="text-sm"
                    />
                  ),
              },
            ]
          : undefined
      }
    >
      {error && (
        <div className="flex h-[200px] flex-col items-center justify-center gap-2 text-sm text-slate-500">
          {error}
          <button
            type="button"
            onClick={retry}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <LuRefreshCw className="size-3.5" /> Retry
          </button>
        </div>
      )}
      {!error && !data && (
        <div
          aria-hidden
          className="h-[200px] animate-pulse rounded-xl bg-slate-50"
        />
      )}
      {data && (
        <WeekBarChart
          label="Pickup requests submitted each day this week"
          unit="requests"
          bars={data.thisWeek.map((day, i) => {
            let state: 'past' | 'today' | 'upcoming' = 'past';
            if (i === data.todayIndex) state = 'today';
            else if (i > data.todayIndex) state = 'upcoming';
            return { label: DAYS[i] ?? '', value: day.count, state };
          })}
        />
      )}
    </ChartCard>
  );
};

export { PickupsThisWeekCard };
