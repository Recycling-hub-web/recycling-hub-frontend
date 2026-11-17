import { useCallback, useEffect, useRef, useState } from 'react';

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

  const requestGeneration = useRef(0);

  const refetch = useCallback(async () => {
    requestGeneration.current += 1;
    const generation = requestGeneration.current;
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
      if (generation !== requestGeneration.current) return;
      setEntries(data.results);
      setCount(data.count);
    } catch (err) {
      if (generation !== requestGeneration.current) return;
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not load the activity log.',
      );
    } finally {
      if (generation === requestGeneration.current) setLoading(false);
    }
  }, [page, module, action, actor, entityType, objectId]);

  useEffect(() => {
    refetch();
    return () => {
      requestGeneration.current += 1;
    };
  }, [refetch]);

  return { entries, count, loading, error, refetch };
};

export { useActivityLog };
