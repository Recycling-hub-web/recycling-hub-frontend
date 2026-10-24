import type { BadgeVariant } from '../badges/variants';

// Same hex values as SOLID_VARIANT_CLASSES' backgrounds (ui/badges/variants.ts)
// — a chart's color and a status badge's color should always read as the
// same color, not two approximations of it. Charting libraries need a real
// color value, not a Tailwind class string, so this is the one place that
// value is duplicated as hex.
const CHART_VARIANT_COLORS: Record<BadgeVariant, string> = {
  success: '#007535',
  danger: '#b91c1c',
  warning: '#f59e0b',
  attention: '#c2410c',
  info: '#1173b8',
  neutral: '#475569',
};

// Fallback rotation for series/slices with no explicit status meaning
// (e.g. an arbitrary multi-series LineChart) — same colors, fixed order.
const CHART_COLOR_ROTATION: string[] = [
  CHART_VARIANT_COLORS.success,
  CHART_VARIANT_COLORS.info,
  CHART_VARIANT_COLORS.attention,
  CHART_VARIANT_COLORS.danger,
  CHART_VARIANT_COLORS.warning,
  CHART_VARIANT_COLORS.neutral,
];

export { CHART_COLOR_ROTATION, CHART_VARIANT_COLORS };
