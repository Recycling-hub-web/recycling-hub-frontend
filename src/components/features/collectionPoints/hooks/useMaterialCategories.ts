import { useEffect, useState } from 'react';

import { apiFetch } from '../../../../lib/api';

type CategoryOption = { id: string; name: string };
type Paginated<T> = { results: T[] };

/** Options for the "Accepted categories" picker — the same materials-
 * scoped slice of the generic Category model every other module's
 * category picker uses (see features/pickups/hooks/usePickupCategories,
 * which this mirrors). A one-off fetch, not worth a whole service
 * module for — this feature only ever reads it, never writes it. */
const useMaterialCategories = () => {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<Paginated<CategoryOption>>(
      '/categories/?module=materials&is_active=true&page_size=200',
    )
      .then((data) => setCategories(data.results))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
};

export { useMaterialCategories };
export type { CategoryOption };
