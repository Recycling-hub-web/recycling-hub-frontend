import { useState } from 'react';

import { deleteBlogMedia } from '../services/blogService';

const useDeleteBlogMedia = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (id: string) => {
    setLoading(true);
    try {
      await deleteBlogMedia(id);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useDeleteBlogMedia };
