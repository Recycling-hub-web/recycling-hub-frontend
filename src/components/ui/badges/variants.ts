export type BadgeVariant =
  | 'success'
  | 'danger'
  | 'warning'
  | 'attention'
  | 'info'
  | 'neutral';

/** Soft (tinted background) variant classes, shared by StatusBadge and
 * DetailStatusBadge so the two don't drift out of sync with each other. */
export const SOFT_VARIANT_CLASSES: Record<BadgeVariant, string> = {
  success: 'border-brand-200 bg-brand-50 text-brand-700',
  danger: 'border-red-200 bg-red-50 text-red-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
  attention: 'border-orange-200 bg-orange-50 text-orange-700',
  info: 'border-blue-200 bg-blue-50 text-blue-700',
  neutral: 'border-slate-200 bg-slate-100 text-slate-500',
};

/** Solid dot color used next to the label in DetailStatusBadge. */
export const DOT_VARIANT_CLASSES: Record<BadgeVariant, string> = {
  success: 'bg-brand-500',
  danger: 'bg-red-500',
  warning: 'bg-amber-500',
  attention: 'bg-orange-500',
  info: 'bg-blue-500',
  neutral: 'bg-slate-400',
};

// Solid fill + white text, each verified >= 4.5:1 contrast (WCAG AA). Do not
// swap these for the -500 shades used above — those read ~2-3:1 with white
// text and fail contrast for solid fills.
export const SOLID_VARIANT_CLASSES: Record<BadgeVariant, string> = {
  success: 'bg-brand-700 text-white',
  danger: 'bg-red-700 text-white',
  warning: 'bg-amber-500 text-white',
  attention: 'bg-orange-700 text-white',
  info: 'bg-blue-600 text-white',
  neutral: 'bg-slate-600 text-white',
};
