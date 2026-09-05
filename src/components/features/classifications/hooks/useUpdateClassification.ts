import { useState } from 'react';

import type { UpdateClassificationPayload } from '../services/classificationService';
import { updateClassification } from '../services/classificationService';

const useUpdateClassification = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (id: string, payload: UpdateClassificationPayload) => {
    setLoading(true);
    try {
      return await updateClassification(id, payload);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useUpdateClassification };
