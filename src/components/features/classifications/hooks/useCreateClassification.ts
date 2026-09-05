import { useState } from 'react';

import { ApiError } from '../../../../lib/api';
import type { CreateClassificationPayload } from '../services/classificationService';
import { createClassification } from '../services/classificationService';

const useCreateClassification = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const execute = async (payload: CreateClassificationPayload) => {
    setLoading(true);
    setError('');
    try {
      return await createClassification(payload);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not create the classification.',
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export { useCreateClassification };
