import { useEffect, useState } from 'react';

import { NONE_CATEGORY } from '../constants';
import { listPostCategories } from '../services/blogService';

/** Options for the category SelectField — sourced from the `posts`-scoped
 * slice of the generic Category model (see blogService.listPostCategories).
 * Fetches once per mount; today's real data has zero posts-categories
 * seeded, so this will just show "None" until one exists. */
const usePostCategories = () => {
  const [options, setOptions] = useState<{ value: string; label: string }[]>([
    { value: NONE_CATEGORY, label: 'None' },
  ]);

  useEffect(() => {
    listPostCategories().then((data) => {
      setOptions([
        { value: NONE_CATEGORY, label: 'None' },
        ...data.results.map((c) => ({ value: c.id, label: c.name })),
      ]);
    });
  }, []);

  return options;
};

export { usePostCategories };
