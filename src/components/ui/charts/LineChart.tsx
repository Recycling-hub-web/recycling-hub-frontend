'use client';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { CHART_COLOR_ROTATION } from './chartColors';
import { ChartFrame } from './ChartFrame';

type LineChartSeries = {
  /** Key read off each row in `data`. */
  key: string;
  /** Legend/tooltip label — pass the translated string, not a key. */
  label: string;
  /** Hex color; falls back to the shared rotation if omitted. */
  color?: string;
};

type LineChartProps = {
  /** One row per x-axis point, e.g. `{ x: '2026-10-01', volume: 5 }`. */
  data: Record<string, string | number>[];
  /** Which field in each row is the x-axis label. */
  xKey: string;
  series: LineChartSeries[];
  height?: number;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  emptyMessage?: string;
};

/** Shared trend chart — revenue/volume/payouts over time, or any other
 * x-axis-over-value series. One line per entry in `series`. See
 * ChartFrame for the shared loading/error/empty handling. */
const LineChart = ({
  data,
  xKey,
  series,
  height = 240,
  loading,
  error,
  onRetry,
  emptyMessage,
}: LineChartProps) => (
  <ChartFrame
    height={height}
    loading={loading}
    error={error}
    onRetry={onRetry}
    isEmpty={data.length === 0}
    emptyMessage={emptyMessage}
  >
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={data} margin={{ top: 8, right: 8, left: -16 }}>
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
        />
        {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
        {series.map((s, i) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={
              s.color ?? CHART_COLOR_ROTATION[i % CHART_COLOR_ROTATION.length]
            }
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  </ChartFrame>
);

export { LineChart };
export type { LineChartProps, LineChartSeries };
