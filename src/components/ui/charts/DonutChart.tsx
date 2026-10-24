'use client';

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import type { BadgeVariant } from '../badges/variants';
import { CHART_COLOR_ROTATION, CHART_VARIANT_COLORS } from './chartColors';
import { ChartFrame } from './ChartFrame';

type DonutChartDatum = {
  key: string;
  /** Legend/tooltip label — pass the translated string, not a key. */
  label: string;
  value: number;
  /** Reuses the same status→color mapping as StatusBadge, so a slice
   * always matches the badge it represents (e.g. a `claimed` finance
   * status always renders the same color here as on its StatusBadge). */
  variant?: BadgeVariant;
};

type DonutChartProps = {
  data: DonutChartDatum[];
  height?: number;
  /** Shown centered inside the ring — typically the total. */
  centerLabel?: string;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  emptyMessage?: string;
};

/** Shared part-to-whole chart — a status/category breakdown. See
 * ChartFrame for the shared loading/error/empty handling. */
const DonutChart = ({
  data,
  height = 240,
  centerLabel,
  loading,
  error,
  onRetry,
  emptyMessage,
}: DonutChartProps) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <ChartFrame
      height={height}
      loading={loading}
      error={error}
      onRetry={onRetry}
      isEmpty={total === 0}
      emptyMessage={emptyMessage}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius="60%"
            outerRadius="85%"
            paddingAngle={2}
          >
            {data.map((d, i) => (
              <Cell
                key={d.key}
                fill={
                  d.variant
                    ? CHART_VARIANT_COLORS[d.variant]
                    : CHART_COLOR_ROTATION[i % CHART_COLOR_ROTATION.length]
                }
              />
            ))}
          </Pie>
          {centerLabel && (
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-slate-900 text-sm font-semibold"
            >
              {centerLabel}
            </text>
          )}
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              borderColor: '#e2e8f0',
              fontSize: 12,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
};

export { DonutChart };
export type { DonutChartDatum, DonutChartProps };
