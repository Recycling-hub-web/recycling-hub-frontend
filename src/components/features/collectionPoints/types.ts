// Mirrors apps.collection_points.models.CollectionPoint
// (CollectionPointSerializer) on the backend — one flat shape, no
// separate list/detail split (the serializer doesn't have one).
// `accepted_categories` is a PrimaryKeyRelatedField(many=True) on the
// backend, so it comes back as plain category id strings, not nested
// objects — see useMaterialCategories for the id->name lookup used to
// display them. Unlike Category/Classification's `name_ar`, this one is
// genuinely writable (entered directly by staff/admin, not
// machine-translated — location names are proper nouns, same as
// Branch.name_ar was).
type CollectionPoint = {
  id: string;
  point_uid: string;
  name: string;
  name_ar: string;
  address: string;
  city: string;
  postcode: string;
  latitude: string | null;
  longitude: string | null;
  operating_hours: string;
  accepted_categories: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type { CollectionPoint };
