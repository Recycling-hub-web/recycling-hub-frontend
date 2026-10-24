import { useState } from 'react';

import type { UpdateCategoryPayload } from '../services/categoryService';
import { updateCategory } from '../services/categoryService';

const useUpdateCategory = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (id: string, payload: UpdateCategoryPayload) => {
    setLoading(true);
    try {
      return await updateCategory(id, payload);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useUpdateCategory };
