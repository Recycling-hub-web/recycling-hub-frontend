import { useCallback, useEffect, useState } from 'react';

import type { PickupHeatmap } from '../services/overviewService';
import { getPickupHeatmap, getPickupVolume } from '../services/overviewService';

/** A local calendar date as YYYY-MM-DD (not UTC — the backend cuts days
 * at Malaysian midnight, and so does the browser here). */
const isoDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const mondayOf = (d: Date) => {
  const monday = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return monday;
};

type PickupWeek = {
  /** Mon → Sun of this week; days after today have no count yet. */
  thisWeek: { date: string; count: number }[];
  todayIndex: number;
  thisWeekTotal: number;
  lastWeekTotal: number;
  /** Weekly totals for the last 9 weeks, oldest first (this week last). */
  recentWeeks: number[];
};

/** This week day by day, last week's total, and the last 9 weeks — the
 * Admin/Staff overview's "requests this week" card and stat. Two
 * requests to the same pickup-volume endpoint the trend chart uses. */
const usePickupWeek = () => {
  const [data, setData] = useState<PickupWeek | null>(null);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;
    const today = new Date();
    const monday = mondayOf(today);
    const lastMonday = new Date(monday);
    lastMonday.setDate(lastMonday.getDate() - 7);
    const sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 6);
    const nineWeeksAgo = new Date(monday);
    nineWeeksAgo.setDate(nineWeeksAgo.getDate() - 8 * 7);

    setError('');
    Promise.all([
      getPickupVolume({
        range: 'custom',
        from: isoDate(lastMonday),
        to: isoDate(sunday),
      }),
      getPickupVolume({
        range: 'custom',
        from: isoDate(nineWeeksAgo),
        to: isoDate(sunday),
      }),
    ])
      .then(([days, weeks]) => {
        if (cancelled) return;
        const byDate = new Map(days.points.map((p) => [p.date, p.count]));
        const week = Array.from({ length: 7 }, (_, i) => {
          const d = new Date(monday);
          d.setDate(d.getDate() + i);
          return { date: isoDate(d), count: byDate.get(isoDate(d)) ?? 0 };
        });
        let lastWeekTotal = 0;
        for (let i = 0; i < 7; i += 1) {
          const d = new Date(lastMonday);
          d.setDate(d.getDate() + i);
          lastWeekTotal += byDate.get(isoDate(d)) ?? 0;
        }
        setData({
          thisWeek: week,
          todayIndex: (today.getDay() + 6) % 7,
          thisWeekTotal: week.reduce((sum, d) => sum + d.count, 0),
          lastWeekTotal,
          recentWeeks: weeks.points.slice(-9).map((p) => p.count),
        });
      })
      .catch(() => {
        if (!cancelled) setError('Could not load this week.');
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  return { data, error, retry };
};

/** Pickup requests by weekday × hour — the overview heatmap. */
const usePickupHeatmap = (days = 90) => {
  const [data, setData] = useState<PickupHeatmap | null>(null);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;
    setError('');
    getPickupHeatmap(days)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load pickup times.');
      });
    return () => {
      cancelled = true;
    };
  }, [days, attempt]);

  return { data, error, retry };
};

/** Percent change from `before` to `now`, or null when there's nothing to
 * compare with (a 0 → n jump has no meaningful percentage). */
const percentChange = (now: number, before: number): number | null =>
  before > 0 ? Math.round(((now - before) / before) * 100) : null;

export { percentChange, usePickupHeatmap, usePickupWeek };
export type { PickupWeek };
export type PickupWeekState = ReturnType<typeof usePickupWeek>;
