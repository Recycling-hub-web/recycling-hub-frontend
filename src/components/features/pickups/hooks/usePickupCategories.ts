import { useCallback, useEffect, useRef, useState } from 'react';

import { apiFetch } from '../../../../lib/api';
import type { QuantityUnit, UnitsByCategory } from '../units';

type CategoryOption = { value: string; label: string };
type Paginated<T> = { results: T[] };

/** Options for the category SelectField on both the public and admin/
 * staff pickup-request forms — the materials-scoped slice of the generic
 * Category model (see features/categories), active only (mirrors
 * blogs' usePostCategories, which requests page_size=200 so this shows
 * every materials category rather than truncating to the first 12). No
 * public endpoint-specific service module for this — it's a one-off
 * fetch, not worth a whole categoryService-style file here. */
const usePickupCategories = () => {
  const [options, setOptions] = useState<CategoryOption[]>([]);
  // How each material is measured (kg, unit, or both) — the item
  // editors only offer these units for the chosen category.
  const [unitsByCategory, setUnitsByCategory] = useState<UnitsByCategory>({});
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');
  const generation = useRef(0);
  const refetch = useCallback(async () => {
    generation.current += 1;
    const request = generation.current;
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch<
        Paginated<{
          id: string;
          name: string;
          allowed_quantity_units?: QuantityUnit[];
        }>
      >('/categories/?module=materials&is_active=true&page_size=200');
      if (request !== generation.current) return;
      setOptions(data.results.map((c) => ({ value: c.id, label: c.name })));
      setUnitsByCategory(
        Object.fromEntries(
          data.results.map((c) => [
            c.id,
            c.allowed_quantity_units?.length
              ? c.allowed_quantity_units
              : ['kg'],
          ]),
        ),
      );
    } catch {
      if (request === generation.current)
        setError('Could not load materials. Please try again.');
    } finally {
      if (request === generation.current) setLoading(false);
    }
  }, []);
  useEffect(() => {
    refetch();
    return () => {
      generation.current += 1;
    };
  }, [refetch]);
  return { options, unitsByCategory, loading, error, refetch };
};
export { usePickupCategories };
