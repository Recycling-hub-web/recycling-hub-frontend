'use client';

import { useEffect, useState } from 'react';
import { LuChartPie } from 'react-icons/lu';

import { EmptyState } from '../empty/EmptyState';

type GaugeSegment = {
  key: string;
  label: string;
  value: number;
  /** A mark color — never used for text. */
  color: string;
};

type GaugeChartProps = {
  /** Parts of one whole, in the order they're drawn (start → end). */
  segments: GaugeSegment[];
  /** The headline in the middle, e.g. "62%". Defaults to the first part's share. */
  centerValue?: string;
  centerLabel: string;
  /** What the gauge measures, for screen readers. */
  label: string;
  /** Unit for hover text: "orders". */
  unit?: string;
  /** Defaults to the page's own direction. */
  dir?: 'ltr' | 'rtl';
};

const CX = 100;
const CY = 100;
const R = 78;
const STROKE = 22;
// The 2px surface gap between neighbors, as an angle on this radius.
const GAP_DEG = (2 / R) * (180 / Math.PI);

const point = (deg: number) => {
  const rad = (deg * Math.PI) / 180;
  return `${CX + R * Math.cos(rad)} ${CY - R * Math.sin(rad)}`;
};

/** An arc from `from` to `to` degrees (180 = left end, 0 = right end). */
const arc = (from: number, to: number) =>
  `M ${point(from)} A ${R} ${R} 0 0 ${from > to ? 1 : 0} ${point(to)}`;

/** Whole-number shares that always add up to 100 (largest remainder). */
const sharesOf = (values: number[]) => {
  const total = values.reduce((a, b) => a + b, 0);
  if (!total) return values.map(() => 0);
  const raw = values.map((v) => (v / total) * 100);
  const floors = raw.map(Math.floor);
  let left = 100 - floors.reduce((a, b) => a + b, 0);
  raw
    .map((v, i) => ({ i, rest: v - Math.floor(v) }))
    .sort((a, b) => b.rest - a.rest)
    .forEach(({ i }) => {
      if (left > 0) {
        floors[i] = (floors[i] ?? 0) + 1;
        left -= 1;
      }
    });
  return floors;
};

/** A half-donut for one whole split into parts — "62% placed" with the
 * rest beside it. The middle shows the headline (or the hovered part),
 * and the legend repeats every part's share, so nothing is color-only. */
const GaugeChart = ({
  segments,
  centerValue,
  centerLabel,
  label,
  unit = '',
  dir,
}: GaugeChartProps) => {
  const [pageDir, setPageDir] = useState<'ltr' | 'rtl'>('ltr');
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    setPageDir(document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr');
  }, []);
  const rtl = (dir ?? pageDir) === 'rtl';

  const total = segments.reduce((sum, s) => sum + s.value, 0);
  if (!total) {
    return (
      <EmptyState
        size="compact"
        icon={<LuChartPie className="size-5" />}
        title="Nothing to show yet"
        description="The split appears once there's activity."
      />
    );
  }

  const shares = sharesOf(segments.map((s) => s.value));
  const visible = segments.filter((s) => s.value > 0);
  let cursor = 0;
  const arcs = segments.map((segment) => {
    const start = cursor;
    cursor += segment.value / total;
    if (!segment.value) return null;
    const isFirst = visible[0]?.key === segment.key;
    const isLast = visible[visible.length - 1]?.key === segment.key;
    // Angles measured from the start end (left in LTR, right in RTL).
    const a1 = start * 180 + (isFirst ? 0 : GAP_DEG / 2);
    const a2 = cursor * 180 - (isLast ? 0 : GAP_DEG / 2);
    const toDeg = (a: number) => (rtl ? a : 180 - a);
    return { segment, d: arc(toDeg(a1), toDeg(a2)) };
  });

  const activeIndex = segments.findIndex((s) => s.key === active);
  const activeSegment = segments[activeIndex];
  const headline = activeSegment
    ? `${shares[activeIndex]}%`
    : centerValue ?? `${shares[0]}%`;
  const subline = activeSegment
    ? `${activeSegment.label} · ${activeSegment.value.toLocaleString()} ${unit}`.trim()
    : centerLabel;

  return (
    <div dir={rtl ? 'rtl' : 'ltr'}>
      <div className="relative mx-auto max-w-xs">
        <svg
          viewBox="0 0 200 116"
          className="w-full overflow-visible"
          role="img"
          aria-label={`${label}: ${segments
            .map((s, i) => `${s.label} ${shares[i]}%`)
            .join(', ')}`}
        >
          {/* Track: the rounded ends sit under the first and last parts. */}
          <path
            d={arc(180, 0)}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={STROKE}
            strokeLinecap="round"
          />
          {arcs.map(
            (a) =>
              a && (
                <path
                  key={a.segment.key}
                  d={a.d}
                  fill="none"
                  stroke={a.segment.color}
                  strokeWidth={STROKE}
                  opacity={active && active !== a.segment.key ? 0.35 : 1}
                  className="cursor-pointer transition-opacity duration-200"
                  onMouseEnter={() => setActive(a.segment.key)}
                  onMouseLeave={() => setActive(null)}
                />
              ),
          )}
        </svg>
        <div className="pointer-events-none absolute inset-x-0 bottom-1 text-center">
          <p className="text-4xl font-bold tracking-tight text-neutral-950">
            {headline}
          </p>
          <p className="mt-0.5 truncate px-10 text-sm text-slate-500">
            {subline}
          </p>
        </div>
      </div>

      <ul
        className="mt-5 grid gap-3"
        style={{
          gridTemplateColumns: `repeat(${segments.length}, minmax(0, 1fr))`,
        }}
      >
        {segments.map((s, i) => (
          <li key={s.key}>
            <button
              type="button"
              onMouseEnter={() => setActive(s.key)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(s.key)}
              onBlur={() => setActive(null)}
              className="w-full rounded-lg text-start focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
            >
              <span className="flex items-center gap-2 text-sm text-slate-600">
                <span
                  aria-hidden
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                <span className="truncate">{s.label}</span>
              </span>
              <span className="mt-1 block text-2xl font-semibold text-neutral-950">
                {shares[i]}%
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export { GaugeChart };
export type { GaugeChartProps, GaugeSegment };
