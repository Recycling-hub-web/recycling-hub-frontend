'use client';

import { useState } from 'react';

type HeatmapProps = {
  rowLabels: string[];
  columnLabels: string[];
  /** Full column names for screen readers when the visible labels are
   * shortened ("9" shown, "9am" read). Defaults to `columnLabels`. */
  columnNames?: string[];
  /** `values[row][column]`, same shape as the labels. */
  values: number[][];
  /** Unit for the tooltip: "requests". */
  unit: string;
  /** What the grid shows, for screen readers. */
  label: string;
};

// Sequential: one hue, light → dark. Level 0 (none) is a neutral step,
// so "nothing" never reads as "a little".
const LEVELS = [
  'bg-slate-100',
  'bg-brand-100',
  'bg-brand-300',
  'bg-brand-500',
  'bg-brand-700',
];

/** 0 for an empty cell, then 1–4 by quarters of the busiest cell. */
const levelOf = (value: number, max: number) =>
  value <= 0 || max <= 0 ? 0 : Math.min(4, Math.ceil((value / max) * 4));

/** A grid of rows × columns (days × hours) where each cell's shade is
 * how much happened there. Hover or focus a cell for its exact count;
 * the Less → More scale explains the shades. */
const Heatmap = ({
  rowLabels,
  columnLabels,
  columnNames = columnLabels,
  values,
  unit,
  label,
}: HeatmapProps) => {
  const [active, setActive] = useState<{ r: number; c: number } | null>(null);
  const max = Math.max(0, ...values.flat());

  return (
    <div>
      <div className="overflow-x-auto pb-1">
        <table
          className="w-full min-w-[22rem] table-fixed border-separate"
          style={{ borderSpacing: 4 }}
          aria-label={label}
        >
          <thead>
            <tr>
              <th aria-hidden className="w-10" />
              {columnLabels.map((col) => (
                <th
                  key={col}
                  scope="col"
                  className="truncate pb-1 text-center text-xs font-normal text-slate-500"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowLabels.map((row, r) => (
              <tr key={row}>
                <th
                  scope="row"
                  className="pe-2 text-start text-sm font-normal text-slate-600"
                >
                  {row}
                </th>
                {columnLabels.map((col, c) => {
                  const colName = columnNames[c] ?? col;
                  const value = values[r]?.[c] ?? 0;
                  const isActive = active?.r === r && active?.c === c;
                  const text = `${row} ${colName}: ${value.toLocaleString()} ${unit}`;
                  return (
                    <td key={col} className="p-0">
                      <button
                        type="button"
                        aria-label={text}
                        onMouseEnter={() => setActive({ r, c })}
                        onMouseLeave={() => setActive(null)}
                        onFocus={() => setActive({ r, c })}
                        onBlur={() => setActive(null)}
                        className={`relative block aspect-square w-full rounded-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${LEVELS[levelOf(value, max)]} ${isActive ? 'ring-2 ring-neutral-950/70' : ''}`}
                      >
                        {isActive && (
                          <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-full bg-neutral-950 px-3 py-1 text-xs font-medium text-white">
                            {value.toLocaleString()} {unit}
                          </span>
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className="mt-3 flex items-center justify-end gap-1.5 text-sm text-slate-500"
        aria-hidden
      >
        <span className="me-1">Less</span>
        {LEVELS.map((cls) => (
          <span key={cls} className={`size-4 rounded ${cls}`} />
        ))}
        <span className="ms-1">More</span>
      </div>
    </div>
  );
};

export { Heatmap };
export type { HeatmapProps };
