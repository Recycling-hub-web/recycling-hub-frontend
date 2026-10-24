import { useCallback, useEffect, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import type { RoleLimitSettings } from '../services/userService';
import { getRoleLimits } from '../services/userService';

/** Super Admin only (403 for everyone else, see SystemSettingsView) —
 * powers the Administrators tab's two StatTiles, the Create User role
 * picker's "limit reached" disabled state, and SystemSettingsPage
 * itself. Pass `enabled: false` for any other role so the page doesn't
 * fire a request that's just going to 403 — not needed for
 * correctness (this fails soft to `null` either way), just to avoid
 * the noise. */
const useRoleLimits = (enabled = true) => {
  const [limits, setLimits] = useState<RoleLimitSettings | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError('');
    try {
      setLimits(await getRoleLimits());
    } catch (err) {
      setLimits(null);
      setError(
        err instanceof ApiError ? err.message : 'Could not load role limits.',
      );
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { limits, loading, error, refetch };
};

export { useRoleLimits };
