import { useCallback, useEffect, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { listActivityLog } from '../services/activityService';
import type {
  ActivityAction,
  ActivityLogEntry,
  ActivityModule,
} from '../types';

type UseActivityLogParams = {
  page: number;
  module?: ActivityModule;
  action?: ActivityAction;
  actor?: string;
  entityType?: string;
  objectId?: string;
};

const useActivityLog = ({
  page,
  module,
  action,
  actor,
  entityType,
  objectId,
}: UseActivityLogParams) => {
  const [entries, setEntries] = useState<ActivityLogEntry[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listActivityLog({
        page,
        module,
        action,
        actor,
        entityType,
        objectId,
      });
      setEntries(data.results);
      setCount(data.count);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not load the activity log.',
      );
    } finally {
      setLoading(false);
    }
  }, [page, module, action, actor, entityType, objectId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { entries, count, loading, error, refetch };
};

export { useActivityLog };
