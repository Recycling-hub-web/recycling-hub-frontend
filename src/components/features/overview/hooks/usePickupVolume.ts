import { useCallback, useEffect, useState } from 'react';

import type {
  PickupVolume,
  PickupVolumeQuery,
} from '../services/overviewService';
import {
  getAccountingVolume,
  getDriverPickupVolume,
  getPickupVolume,
  getReceivingVolume,
  getSuperAdminPickupVolume,
} from '../services/overviewService';

const DEFAULT_QUERY: PickupVolumeQuery = { range: '30d' };
const PRESETS = ['7d', '30d', '3m', '6m', '12m', 'all'];
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** The last range this browser picked for `storageKey` — a per-viewer
 * convenience, so it falls back to the 30-day default if storage is
 * blocked or holds anything unexpected. */
const readStoredQuery = (storageKey: string): PickupVolumeQuery => {
  try {
    const stored = JSON.parse(window.localStorage.getItem(storageKey) ?? '');
    if (PRESETS.includes(stored?.range)) return { range: stored.range };
    if (
      stored?.range === 'custom' &&
      ISO_DATE.test(stored.from) &&
      ISO_DATE.test(stored.to)
    ) {
      return { range: 'custom', from: stored.from, to: stored.to };
    }
  } catch {
    // Missing, malformed, or storage unavailable — use the default.
  }
  return DEFAULT_QUERY;
};

const queryKey = (query: PickupVolumeQuery) =>
  query.range === 'custom' ? `custom:${query.from}:${query.to}` : query.range;

/** A volume-over-a-selectable-range chart's data (one role's own
 * `/dashboard/.../volume/`-shaped endpoint — see overviewService.ts).
 * The chosen range is remembered per browser, under `storageKey` (so
 * each role's chart remembers its own range independently). Responses
 * for a range the viewer has already moved away from are ignored. */
const useVolume = (
  storageKey: string,
  fetchVolume: (query: PickupVolumeQuery) => Promise<PickupVolume>,
) => {
  // null until mounted — the stored range is only readable in the
  // browser, so this avoids a server/client render mismatch and a
  // wasted fetch of the default range first.
  const [query, setQuery] = useState<PickupVolumeQuery | null>(null);
  const [data, setData] = useState<PickupVolume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setQuery(readStoredQuery(storageKey));
    // Only the initial read depends on `storageKey` — it never changes
    // for a given chart instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const key = query ? queryKey(query) : null;

  useEffect(() => {
    if (!query) return undefined;
    let cancelled = false;
    setLoading(true);
    setError('');
    fetchVolume(query)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load volume.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // `key` captures every part of `query` that matters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, attempt]);

  const select = useCallback(
    (next: PickupVolumeQuery) => {
      setQuery(next);
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // Storage blocked — the choice just won't be remembered.
      }
    },
    [storageKey],
  );

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { query, select, data, loading, error, retry };
};

// Admin/Staff's pickup volume (every request created, whatever its
// status — demand, not completed collections).
const usePickupVolume = () =>
  useVolume('rh_pickup_volume_range', getPickupVolume);

// Driver's own pickup volume, scoped to their own assigned requests.
const useDriverPickupVolume = () =>
  useVolume('rh_driver_pickup_volume_range', getDriverPickupVolume);

// Receiving Officer's closed-delivery volume.
const useReceivingVolume = () =>
  useVolume('rh_receiving_volume_range', getReceivingVolume);

// Accounting's reimbursed-volume.
const useAccountingVolume = () =>
  useVolume('rh_accounting_volume_range', getAccountingVolume);

// Super Admin's org-wide pickup volume.
const useSuperAdminPickupVolume = () =>
  useVolume('rh_super_admin_pickup_volume_range', getSuperAdminPickupVolume);

export {
  useAccountingVolume,
  useDriverPickupVolume,
  usePickupVolume,
  useReceivingVolume,
  useSuperAdminPickupVolume,
};
