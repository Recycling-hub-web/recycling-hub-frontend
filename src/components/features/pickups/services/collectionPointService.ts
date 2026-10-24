import { apiFetch } from '../../../../lib/api';
import type { CollectionPointOption } from '../types';

type Paginated<T> = { results: T[] };

// GET /collection-points/ — public (CollectionPointViewSet.list is
// AllowAny), already existed for the public "find a drop-off point"
// flow. A non-admin/staff caller (every caller of this feature — it's
// driver-only) already gets is_active-only results server-side
// (CollectionPointViewSet.get_queryset), no filter param needed.
// page_size=200 since there are only ever a handful of these, same
// reasoning as usePickupCategories.
const listCollectionPoints = (): Promise<CollectionPointOption[]> =>
  apiFetch<Paginated<CollectionPointOption>>(
    '/collection-points/?page_size=200',
  ).then((data) => data.results);

export { listCollectionPoints };
