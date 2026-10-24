import { apiFetch } from '../../../../lib/api';
import type { Partner, PartnershipType } from '../types';

type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

type ListPartnersParams = {
  page?: number;
  partnershipType?: PartnershipType | '';
  /** `?is_active=` — staff/admin only (a public request is already
   * hard-filtered to active). Added alongside this feature since
   * PartnerViewSet.get_queryset previously only supported
   * `?partnership_type=`. */
  isActive?: 'true' | 'false';
  /** DRF's SearchFilter — matches name (PartnerViewSet.search_fields). */
  search?: string;
};

const listPartners = ({
  page = 1,
  partnershipType,
  isActive,
  search,
}: ListPartnersParams = {}): Promise<Paginated<Partner>> => {
  const params = new URLSearchParams({ page: String(page) });
  if (partnershipType) params.set('partnership_type', partnershipType);
  if (isActive) params.set('is_active', isActive);
  if (search) params.set('search', search);
  return apiFetch(`/partnerships/?${params.toString()}`);
};

const getPartner = (id: string): Promise<Partner> =>
  apiFetch(`/partnerships/${id}/`);

type CreatePartnerPayload = {
  name: string;
  logo: string;
  partnership_type: PartnershipType;
  website_url: string;
};

const createPartner = (payload: CreatePartnerPayload): Promise<Partner> =>
  apiFetch('/partnerships/', { method: 'POST', json: payload });

type UpdatePartnerPayload = Partial<{
  name: string;
  logo: string;
  partnership_type: PartnershipType;
  website_url: string;
  is_active: boolean;
}>;

const updatePartner = (
  id: string,
  payload: UpdatePartnerPayload,
): Promise<Partner> =>
  apiFetch(`/partnerships/${id}/`, { method: 'PATCH', json: payload });

// Soft delete on the backend (PartnerViewSet.perform_destroy sets
// is_active=False, not a real row removal) — same pattern as Categories.
const deletePartner = (id: string): Promise<void> =>
  apiFetch(`/partnerships/${id}/`, { method: 'DELETE' });

export {
  createPartner,
  deletePartner,
  getPartner,
  listPartners,
  updatePartner,
};
export type {
  CreatePartnerPayload,
  ListPartnersParams,
  Paginated,
  UpdatePartnerPayload,
};
