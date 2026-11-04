import { ChartCard } from '../../../ui/card/ChartCard';
import { GaugeChart } from '../../../ui/charts/GaugeChart';
import type { PickupStatus } from '../../pickups/types';

// Validated together (dataviz palette check: CVD separation, contrast vs
// the card) — brand-700, blue-500, orange-600.
const COLORS = { done: '#007535', active: '#1f91d8', cancelled: '#ea580c' };

/** How every order has ended up: done (collected, delivered or closed),
 * still in progress (pending or scheduled), or cancelled. */
const OrderStatusGaugeCard = ({
  counts,
}: {
  counts: Record<PickupStatus, number> | null;
}) => (
  <ChartCard title="Orders by outcome" subtitle="Every order so far">
    {counts ? (
      <GaugeChart
        label="Orders by outcome"
        unit="orders"
        centerLabel="of orders done"
        segments={[
          {
            key: 'done',
            label: 'Done',
            value: counts.collected + counts.delivered + counts.closed,
            color: COLORS.done,
          },
          {
            key: 'active',
            label: 'In progress',
            value: counts.pending + counts.scheduled,
            color: COLORS.active,
          },
          {
            key: 'cancelled',
            label: 'Cancelled',
            value: counts.cancelled,
            color: COLORS.cancelled,
          },
        ]}
      />
    ) : (
      <div
        aria-hidden
        className="h-[220px] animate-pulse rounded-xl bg-slate-50"
      />
    )}
  </ChartCard>
);

export { OrderStatusGaugeCard };
