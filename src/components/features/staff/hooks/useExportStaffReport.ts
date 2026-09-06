import { useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { exportStaffReport } from '../services/staffService';

const useExportStaffReport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const execute = async () => {
    setLoading(true);
    setError('');
    try {
      await exportStaffReport();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not export the staff report.',
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export { useExportStaffReport };
