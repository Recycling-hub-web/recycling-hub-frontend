import { useState } from 'react';

import type { BlogPostPayload } from '../services/blogService';
import { updateBlogPost } from '../services/blogService';

const useUpdateBlogPost = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (id: string, payload: BlogPostPayload) => {
    setLoading(true);
    try {
      return await updateBlogPost(id, payload);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useUpdateBlogPost };
