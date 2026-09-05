import { useEffect, useState } from 'react';

import { listBlogPosts } from '../services/blogService';

/** Options for the Related Posts picker — sourced from one page of
 * listBlogPosts (same "documented limitation, not silently broken"
 * pattern as usePostCategories/the Categories Parent picker: fine while
 * the real post count fits on one page, would need search/pagination if
 * it ever doesn't). Excludes the post being edited — it can't relate to
 * itself (BlogRelation.clean()). */
const usePostOptions = (excludeId?: string) => {
  const [options, setOptions] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    listBlogPosts({ page: 1 }).then((data) => {
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
