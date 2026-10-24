import { useCallback, useEffect, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import type { UserDetail } from '../../../../types/auth';
import { getUser } from '../services/userService';

/** Fetches a single user's full detail — the details/edit pages' one
 * source of truth, mirroring useUsers' shape but singular. */
const useUser = (id: string) => {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getUser(id);
      setUser(data);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not load this user.',
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { user, loading, error, refetch };
};

export { useUser };
