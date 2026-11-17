import { useCallback, useEffect, useRef, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { listStorageFiles } from '../services/storageFileService';
import type { StorageFile } from '../types';

type UseStorageFilesParams = {
  page: number;
  search?: string;
};

/** Fetches one page of uploaded files — mirrors useCategories' shape. */
const useStorageFiles = ({ page, search }: UseStorageFilesParams) => {
  const [files, setFiles] = useState<StorageFile[]>([]);
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
      const data = await listStorageFiles({ page, search });
      if (generation !== requestGeneration.current) return;
      setFiles(data.results);
      setCount(data.count);
    } catch (err) {
      if (generation !== requestGeneration.current) return;
      setError(err instanceof ApiError ? err.message : 'Could not load files.');
    } finally {
      if (generation === requestGeneration.current) setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    refetch();
    return () => {
      requestGeneration.current += 1;
    };
  }, [refetch]);

  return { files, count, loading, error, refetch };
};

export { useStorageFiles };
