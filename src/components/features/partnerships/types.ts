// Mirrors apps.partnerships.models.Partner (PartnerSerializer) on the
// backend — one serializer covers both list and detail, unlike Categories,
// so there's no separate ListItem/detail split here.
type PartnershipType =
  | 'strategic'
  | 'sponsor'
  | 'corporate'
  | 'government'
  | 'ngo'
  | 'academic'
  | 'community';

type Partner = {
  id: string;
  name: string;
  // StorageFileField's read shape — {file_key, public_url} — confirmed
  // live (apps.storage.serializers.StorageFileField.to_representation).
  // Required on the backend (no allow_blank/allow_null), unlike
  // cover_image/profile_photo elsewhere in this codebase.
  logo: { file_key: string; public_url: string | null };
  partnership_type: PartnershipType;
  website_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type { Partner, PartnershipType };
