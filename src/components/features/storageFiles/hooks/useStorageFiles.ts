import { useCallback, useEffect, useState } from 'react';

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

  const refetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listStorageFiles({ page, search });
      setFiles(data.results);
      setCount(data.count);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load files.');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { files, count, loading, error, refetch };
};

export { useStorageFiles };
