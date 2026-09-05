import { useEffect, useState } from 'react';

import { listBlogPosts } from '../services/blogService';

/** Options for the Related Posts picker — sourced from listBlogPosts
 * with page_size=200 (server-capped, apps.core.pagination) so it shows
 * every post rather than silently truncating to page 1's 12. Excludes
 * the post being edited — it can't relate to itself
 * (BlogRelation.clean()). */
const usePostOptions = (excludeId?: string) => {
  const [options, setOptions] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    listBlogPosts({ page: 1, page_size: 200 }).then((data) => {
      setOptions(
        data.results
          .filter((p) => p.id !== excludeId)
          .map((p) => ({ id: p.id, name: p.title })),
      );
    });
  }, [excludeId]);

  return options;
};

export { usePostOptions };
