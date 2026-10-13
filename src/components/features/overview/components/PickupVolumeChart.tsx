'use client';

import { useEffect, useState } from 'react';

import { InputField } from '../../../form/fields/InputField';
import type { SegmentedOption } from '../../../ui/buttons/SegmentedControl';
import { SegmentedControl } from '../../../ui/buttons/SegmentedControl';
import { SectionContainer } from '../../../ui/card/SectionContainer';
import { LineChart } from '../../../ui/charts';
import { FilterSelect } from '../../../ui/FilterSelect';
import { usePickupVolume } from '../hooks';
import type {
  PickupVolume,
  PickupVolumeQuery,
  PickupVolumeRange,
} from '../services/overviewService';

type VolumeHookResult = {
  query: PickupVolumeQuery | null;
  select: (next: PickupVolumeQuery) => void;
  data: PickupVolume | null;
  loading: boolean;
  error: string;
  retry: () => void;
};

type PickupVolumeChartProps = {
  /** Which role's volume endpoint powers this chart — defaults to
   * Admin/Staff's own (usePickupVolume). Driver/Receiving/Accounting/
   * Super Admin each pass their own hook (useDriverPickupVolume etc.,
   * see hooks/usePickupVolume.ts) so the same chart UI/range-picker
   * works for every role's own differently-scoped data. */
  useVolume?: () => VolumeHookResult;
  title?: string;
  seriesLabel?: string;
  /** Caption under the total, e.g. "requests created" — what one count
   * in `points`/`total` actually represents for this role's metric. */
  unitLabel?: string;
  emptyMessage?: string;
};

const RANGE_OPTIONS: SegmentedOption<PickupVolumeRange>[] = [
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
  { value: '3m', label: '3M' },
  { value: '6m', label: '6M' },
  { value: '12m', label: '12M' },
  { value: 'all', label: 'All' },
  { value: 'custom', label: 'Custom' },
];

const RANGE_LABELS: Record<Exclude<PickupVolumeRange, 'custom'>, string> = {
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
  '3m': 'Last 3 months',
  '6m': 'Last 6 months',
  '12m': 'Last 12 months',
  all: 'All time',
};

const RANGE_SELECT_OPTIONS = [
  ...Object.entries(RANGE_LABELS).map(([value, label]) => ({ value, label })),
  { value: 'custom', label: 'Custom range' },
];

const INTERVAL_LABELS: Record<PickupVolume['interval'], string> = {
  day: 'daily',
  week: 'weekly',
  month: 'monthly',
};

// Dates arrive as plain "YYYY-MM-DD" — read and format them as UTC so a
// viewer's own time zone can never shift a label to the neighbouring day.
const asDate = (iso: string) => new Date(`${iso}T00:00:00Z`);
const DAY_FORMAT = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
});
const MONTH_FORMAT = new Intl.DateTimeFormat('en-GB', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});
const FULL_FORMAT = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

const pointLabel = (iso: string, interval: PickupVolume['interval']) =>
  interval === 'month'
    ? MONTH_FORMAT.format(asDate(iso))
    : DAY_FORMAT.format(asDate(iso));

const todayIso = () => {
  // Local calendar date, as YYYY-MM-DD.
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
};

const daysAgoIso = (days: number) => {
  const d = new Date(`${todayIso()}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
};

/** A volume trend over a selectable range (presets or custom dates),
 * with the total for that range — originally Admin/Staff's own "pickup
 * requests created" chart, now the shared chart UI every role's
 * overview uses for its own metric (own pickups / closed deliveries /
 * reimbursements / org-wide pickups — see `useVolume`). The backend
 * picks the grouping from the range's length so the line stays
 * readable; the chosen range is remembered per browser, independently
 * per role (see hooks/usePickupVolume.ts's per-role storage keys). */
const PickupVolumeChart = ({
  useVolume = usePickupVolume,
  title = 'Pickup volume',
  seriesLabel = 'Pickup requests',
  unitLabel = 'requests created',
  emptyMessage = 'No pickup requests in this range.',
}: PickupVolumeChartProps) => {
  const { query, select, data, loading, error, retry } = useVolume();
  const [custom, setCustom] = useState({ from: '', to: '' });
  const [customError, setCustomError] = useState('');

  const activeRange = query?.range ?? '30d';

  // A remembered custom range (from a previous visit) fills the inputs.
  useEffect(() => {
    if (query?.range === 'custom') {
      setCustom({ from: query.from, to: query.to });
    }
  }, [query]);

  const applyCustom = (from: string, to: string) => {
    if (!from || !to) return;
    if (from > to) {
      setCustomError('The start date must be on or before the end date.');
      return;
    }
    setCustomError('');
    select({ range: 'custom', from, to });
  };

  const onRangeChange = (range: PickupVolumeRange) => {
    if (range === 'custom') {
      // Start from the range currently shown, so switching to Custom
      // keeps the chart steady until the dates are changed.
      const from = data?.from ?? daysAgoIso(29);
      const to = data?.to ?? todayIso();
      setCustom({ from, to });
      applyCustom(from, to);
      return;
    }
    setCustomError('');
    select({ range });
  };

  const onCustomChange = (field: string, value: string) => {
    const next = { ...custom, [field]: value };
    setCustom(next);
    applyCustom(next.from, next.to);
  };

  const description = data
    ? `${
        data.range === 'custom'
          ? `${FULL_FORMAT.format(asDate(data.from))} – ${FULL_FORMAT.format(
              asDate(data.to),
            )}`
          : RANGE_LABELS[data.range]
      } · ${INTERVAL_LABELS[data.interval]}`
    : '';

  const chartData =
    data?.points.map((point) => ({
      x: pointLabel(point.date, data.interval),
      count: point.count,
    })) ?? [];

  return (
    <SectionContainer className="lg:col-span-2">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
          <p className="mt-0.5 text-xs text-slate-500">{description || ' '}</p>
        </div>
        <div className="text-end">
          <p
            className="text-xl font-semibold tabular-nums text-neutral-950"
            data-testid="pickup-volume-total"
          >
            {data ? data.total.toLocaleString('en-MY') : '—'}
          </p>
          <p className="text-xs text-slate-500">{unitLabel}</p>
        </div>
      </div>

      {/* Seven options don't fit a phone — a dropdown there, the
          segmented control from sm up. */}
      <FilterSelect
        ariaLabel="Date range"
        value={activeRange}
        onChange={(value) => onRangeChange(value as PickupVolumeRange)}
        options={RANGE_SELECT_OPTIONS}
        className="mb-4 w-full sm:hidden"
      />
      <SegmentedControl
        ariaLabel="Date range"
        options={RANGE_OPTIONS}
        value={activeRange}
        onChange={onRangeChange}
        fullWidth
        className="mb-4 hidden sm:flex"
      />

      {activeRange === 'custom' && (
        <div className="grid gap-x-4 sm:grid-cols-2">
          <InputField
            label="From"
            field="from"
            type="date"
            formData={custom}
            updateFormData={onCustomChange}
            errors={customError ? { from: customError } : undefined}
          />
          <InputField
            label="To"
            field="to"
            type="date"
            formData={custom}
            updateFormData={onCustomChange}
          />
        </div>
      )}

      <LineChart
        data={chartData}
        xKey="x"
        series={[{ key: 'count', label: seriesLabel }]}
        loading={loading && !data}
        error={error}
        onRetry={retry}
        emptyMessage={emptyMessage}
      />
    </SectionContainer>
  );
};

export { PickupVolumeChart };
