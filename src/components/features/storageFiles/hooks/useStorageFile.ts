import { useCallback, useEffect, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { getStorageFile } from '../services/storageFileService';
import type { StorageFile } from '../types';

/** Fetches a single file's full detail — mirrors useCategory's shape. */
const useStorageFile = (uid: string) => {
  const [file, setFile] = useState<StorageFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getStorageFile(uid);
      setFile(data);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not load this file.',
      );
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { file, loading, error, refetch };
};

export { useStorageFile };
