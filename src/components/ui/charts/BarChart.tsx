'use client';

import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { CHART_COLOR_ROTATION } from './chartColors';
import { ChartFrame } from './ChartFrame';

type BarChartSeries = {
  /** Key read off each row in `data`. */
  key: string;
  /** Legend/tooltip label — pass the translated string, not a key. */
  label: string;
  /** Hex color; falls back to the shared rotation if omitted. */
  color?: string;
};

type BarChartProps = {
  /** One row per category, e.g. `{ x: 'Pending', count: 12 }`. */
  data: Record<string, string | number>[];
  /** Which field in each row is the category label. */
  xKey: string;
  series: BarChartSeries[];
  height?: number;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  emptyMessage?: string;
};

/** Shared comparison chart — one bar group per category in `data`, one
 * bar per entry in `series`. See ChartFrame for the shared loading/
 * error/empty handling. */
const BarChart = ({
  data,
  xKey,
  series,
  height = 240,
  loading,
  error,
  onRetry,
  emptyMessage,
}: BarChartProps) => (
  <ChartFrame
    height={height}
    loading={loading}
    error={error}
    onRetry={onRetry}
    isEmpty={data.length === 0}
    emptyMessage={emptyMessage}
  >
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={data} margin={{ top: 8, right: 8, left: -16 }}>
        <CartesianGrid
          stroke="#e2e8f0"
          strokeDasharray="4 4"
          vertical={false}
        />
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 12, fill: '#64748b' }}
          axisLine={{ stroke: '#e2e8f0' }}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 12, fill: '#64748b' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            borderColor: '#e2e8f0',
            fontSize: 12,
          }}
          cursor={{ fill: '#f1f5f9' }}
        />
        {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
        {series.map((s, i) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.label}
            fill={
              s.color ?? CHART_COLOR_ROTATION[i % CHART_COLOR_ROTATION.length]
            }
            radius={[6, 6, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  </ChartFrame>
);

export { BarChart };
export type { BarChartProps, BarChartSeries };
