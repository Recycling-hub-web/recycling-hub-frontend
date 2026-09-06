import { useCallback, useEffect, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { getStaff } from '../services/staffService';
import type { StaffProfileDetail } from '../types';

const useStaffProfile = (id: string) => {
  const [profile, setProfile] = useState<StaffProfileDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setProfile(await getStaff(id));
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not load this staff profile.',
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { profile, loading, error, refetch };
};

export { useStaffProfile };
