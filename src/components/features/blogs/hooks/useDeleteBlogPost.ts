import { useState } from 'react';

import { deleteBlogPost } from '../services/blogService';

const useDeleteBlogPost = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (id: string) => {
    setLoading(true);
    try {
      await deleteBlogPost(id);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useDeleteBlogPost };
