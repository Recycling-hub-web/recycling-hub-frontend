import { useCallback, useEffect, useRef, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import type {
  RegistrationStatus,
  UserListItem,
  UserRole,
} from '../../../../types/auth';
import { listUsers } from '../services/userService';

type UseUsersParams = {
  page: number;
  role?: UserRole;
  search?: string;
  registrationStatus?: RegistrationStatus;
};

/** Fetches one page of the user list — the single fetch UserTable/the
 * admin users page render from, not re-fetched per widget. */
const useUsers = ({
  page,
  role,
  search,
  registrationStatus,
}: UseUsersParams) => {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const requestGeneration = useRef(0);

  const refetch = useCallback(async () => {
    requestGeneration.current += 1;
    const generation = requestGeneration.current;
    setLoading(true);
    setError('');
    try {
      const data = await listUsers({ page, role, search, registrationStatus });
      if (generation !== requestGeneration.current) return;
      setUsers(data.results);
      setCount(data.count);
    } catch (err) {
      if (generation !== requestGeneration.current) return;
      setError(err instanceof ApiError ? err.message : 'Could not load users.');
    } finally {
      if (generation === requestGeneration.current) setLoading(false);
    }
  }, [page, role, search, registrationStatus]);

  useEffect(() => {
    refetch();
    return () => {
      requestGeneration.current += 1;
    };
  }, [refetch]);

  return { users, count, loading, error, refetch };
};

export { useUsers };
