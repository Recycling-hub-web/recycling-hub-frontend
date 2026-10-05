import { useCallback, useEffect, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { getQuickPickupRequest } from '../services/pickupService';
import type { PickupQuickRequestListItem } from '../types';

// `id` is nullable — CreatePickupRequestView only has a lead to prefill
// from when it was reached via a `leadId` search param, not on a plain
// "New request" visit.
const useQuickPickupRequest = (id: string | null) => {
  const [lead, setLead] = useState<PickupQuickRequestListItem | null>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      setLead(await getQuickPickupRequest(id));
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not load this lead.',
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { lead, loading, error, refetch };
};

export { useQuickPickupRequest };
