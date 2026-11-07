type SparkbarsProps = {
  /** Oldest first; the last value is the current period and is drawn in
   * the accent color. */
  values: number[];
  /** What the bars show, for screen readers: "Pickup requests, last 9 weeks". */
  label: string;
  height?: number;
  onSolid?: boolean;
  className?: string;
};

/** A tiny trend of recent periods inside a stat card — no axis, no
 * labels. Past periods in a light step of the brand ramp, the current
 * one in the accent; a 2px gap separates the bars. */
const Sparkbars = ({
  values,
  label,
  height = 40,
  onSolid = false,
  className = '',
}: SparkbarsProps) => {
  const max = Math.max(...values, 1);
  const last = values.length - 1;

  return (
    <div
      role="img"
      aria-label={`${label}: ${values.join(', ')}`}
      className={`flex items-end gap-0.5 ${className}`}
      style={{ height }}
    >
      {values.map((v, i) => {
        let tone = i === last ? 'bg-brand-700' : 'bg-brand-200';
        if (onSolid) tone = i === last ? 'bg-white' : 'bg-white/35';
        return (
          <span
            // eslint-disable-next-line react/no-array-index-key -- fixed-order periods
            key={i}
            className={`min-w-0 flex-1 rounded-t-[3px] ${tone}`}
            // A zero still shows a sliver, so the period isn't missing.
            style={{ height: `${Math.max((v / max) * 100, 6)}%` }}
          />
        );
      })}
    </div>
  );
};

export { Sparkbars };
export type { SparkbarsProps };
