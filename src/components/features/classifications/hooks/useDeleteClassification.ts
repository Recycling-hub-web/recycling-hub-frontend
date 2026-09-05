import { useState } from 'react';

import { deleteClassification } from '../services/classificationService';

const useDeleteClassification = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (id: string) => {
    setLoading(true);
    try {
      await deleteClassification(id);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useDeleteClassification };
