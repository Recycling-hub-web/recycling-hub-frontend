'use client';

import { LuRefreshCw } from 'react-icons/lu';

import { ChartCard } from '../../../ui/card/ChartCard';
import { Heatmap } from '../../../ui/charts/Heatmap';
import { usePickupHeatmap } from '../hooks';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
// Business hours shown: 8am–6pm. Earlier/later requests are rare and
// still counted in the total.
const FIRST_HOUR = 8;
const LAST_HOUR = 18;
const HOURS = Array.from(
  { length: LAST_HOUR - FIRST_HOUR + 1 },
  (_, i) => FIRST_HOUR + i,
);

const fullHour = (h: number) => {
  if (h === 12) return '12pm';
  return h < 12 ? `${h}am` : `${h - 12}pm`;
};

// "8am 9 10 11 12 1pm 2 …" — am/pm only at the start and where the
// afternoon begins, so every label fits its narrow column.
const hourLabel = (h: number) => {
  if (h === FIRST_HOUR) return `${h}am`;
  if (h === 13) return '1pm';
  return String(h > 12 ? h - 12 : h);
};

/** When customers ask to be collected — the weekday and hour of each
 * request's chosen pickup time over the last 90 days, for planning
 * driver shifts. */
const PickupHeatmapCard = () => {
  const { data, error, retry } = usePickupHeatmap(90);

  return (
    <ChartCard
      title="When customers want pickups"
      subtitle={
        data
          ? `${data.total.toLocaleString()} requests in the last 90 days, by chosen time`
          : 'Chosen pickup times, last 90 days'
      }
    >
      {error && (
        <div className="flex h-[260px] flex-col items-center justify-center gap-2 text-sm text-slate-500">
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
          className="h-[260px] animate-pulse rounded-xl bg-slate-50"
        />
      )}
      {data && (
        <Heatmap
          label="Pickup requests by weekday and hour of the chosen pickup time"
          unit="requests"
          rowLabels={DAYS}
          columnLabels={HOURS.map(hourLabel)}
          columnNames={HOURS.map(fullHour)}
          values={data.counts.map((row) => HOURS.map((h) => row[h] ?? 0))}
        />
      )}
    </ChartCard>
  );
};

export { PickupHeatmapCard };
