import { useCallback, useEffect, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import type { UserListItem, UserRole } from '../../../../types/auth';
import { listUsers } from '../services/userService';

type UseUsersParams = {
  page: number;
  role?: UserRole;
  search?: string;
};

/** Fetches one page of the user list — the single fetch UserTable/the
 * admin users page render from, not re-fetched per widget. */
const useUsers = ({ page, role, search }: UseUsersParams) => {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listUsers({ page, role, search });
      setUsers(data.results);
      setCount(data.count);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load users.');
    } finally {
      setLoading(false);
    }
  }, [page, role, search]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { users, count, loading, error, refetch };
};

export { useUsers };
