import { useState } from 'react';

import { deleteCategory } from '../services/categoryService';

const useDeleteCategory = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (id: string) => {
    setLoading(true);
    try {
      await deleteCategory(id);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useDeleteCategory };
