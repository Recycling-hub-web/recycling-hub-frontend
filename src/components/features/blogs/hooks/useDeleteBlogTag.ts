import { useState } from 'react';

import { deleteBlogTag } from '../services/blogService';

const useDeleteBlogTag = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (id: string) => {
    setLoading(true);
    try {
      await deleteBlogTag(id);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useDeleteBlogTag };
