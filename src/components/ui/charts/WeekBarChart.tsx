'use client';

import { useState } from 'react';

type WeekBar = {
  /** Short day name shown under the bar: "Mon". */
  label: string;
  value: number;
  /** `today` is the accent; `upcoming` days are hatched (not over yet). */
  state: 'past' | 'today' | 'upcoming';
};

type WeekBarChartProps = {
  bars: WeekBar[];
  /** Unit for the tooltip: "requests" → "26 requests". */
  unit: string;
  /** What the chart shows, for screen readers. */
  label: string;
  height?: number;
};

// A light diagonal stripe in the brand's light step: the day isn't over,
// so its bar is a placeholder, not a value.
const HATCH =
  'repeating-linear-gradient(135deg, #addac1 0 3px, #f1f5f9 3px 8px)';

/** One column per day of a week: past days in a light step of the
 * brand ramp, today in the accent, upcoming days hatched. Hovering or
 * focusing a bar shows its value in a tooltip; today's shows by
 * default. */
const WeekBarChart = ({
  bars,
  unit,
  label,
  height = 200,
}: WeekBarChartProps) => {
  const todayIndex = bars.findIndex((b) => b.state === 'today');
  const [hovered, setHovered] = useState<number | null>(null);
  const shown = hovered ?? (todayIndex >= 0 ? todayIndex : null);
  const max = Math.max(...bars.map((b) => b.value), 1);

  return (
    <div
      role="group"
      aria-label={label}
      // Top padding keeps the tallest bar's tooltip inside the chart.
      className="flex items-end justify-between gap-2 pt-9"
      style={{ height }}
    >
      {bars.map((bar, i) => {
        const upcoming = bar.state === 'upcoming';
        // Upcoming days draw a short placeholder; a zero still shows a
        // sliver so the day isn't missing.
        const pct = upcoming ? 22 : Math.max((bar.value / max) * 100, 4);
        let fill = 'bg-brand-200';
        if (bar.state === 'today') fill = 'bg-brand-700';
        const tooltip = upcoming
          ? 'Still to come'
          : `${bar.value.toLocaleString()} ${unit}`;

        return (
          <div
            key={bar.label}
            className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
          >
            <button
              type="button"
              aria-label={`${bar.label}: ${tooltip}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              className="relative flex w-full flex-1 items-end justify-center focus:outline-none"
            >
              <span
                className={`relative block w-full max-w-6 rounded-b-md rounded-t-full transition-opacity ${
                  upcoming ? '' : fill
                } ${shown !== null && shown !== i ? 'opacity-70' : ''}`}
                style={{
                  height: `${pct}%`,
                  ...(upcoming ? { backgroundImage: HATCH } : {}),
                }}
              >
                {shown === i && (
                  <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-neutral-950 px-3 py-1 text-xs font-medium text-white">
                    {tooltip}
                  </span>
                )}
              </span>
            </button>
            <span
              className={`mt-3 text-sm ${
                bar.state === 'today'
                  ? 'font-semibold text-neutral-950'
                  : 'text-slate-500'
              }`}
            >
              {bar.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export { WeekBarChart };
export type { WeekBar, WeekBarChartProps };
