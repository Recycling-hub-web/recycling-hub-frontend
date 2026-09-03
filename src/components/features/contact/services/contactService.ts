import { apiFetch } from '../../../../lib/api';
import type { ContactMessage, ContactMessageStatus } from '../types';

type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

type ListContactMessagesParams = {
  page?: number;
  status?: ContactMessageStatus;
  /** DRF's SearchFilter — matches full_name, email, or subject (see
   * ContactMessageViewSet.search_fields on the backend). */
  search?: string;
};

const listContactMessages = ({
  page = 1,
  status,
  search,
}: ListContactMessagesParams = {}): Promise<Paginated<ContactMessage>> => {
  const params = new URLSearchParams({ page: String(page) });
  if (status) params.set('status', status);
  if (search) params.set('search', search);
  return apiFetch(`/contact/?${params.toString()}`);
};

const getContactMessage = (id: string): Promise<ContactMessage> =>
  apiFetch(`/contact/${id}/`);

const updateContactMessageStatus = (
  id: string,
  status: ContactMessageStatus,
): Promise<ContactMessage> =>
  apiFetch(`/contact/${id}/`, { method: 'PATCH', json: { status } });

// Admin only on the backend (ContactMessageViewSet.get_permissions) — a
// staff-role token gets a real 403 here, not just a hidden button.
const deleteContactMessage = (id: string): Promise<void> =>
  apiFetch(`/contact/${id}/`, { method: 'DELETE' });

type SubmitContactMessagePayload = {
  full_name: string;
  email: string;
  phone_number: string;
  subject: string;
  message: string;
};

// Public — no auth, called from the marketing site's /contact page, not
// from inside the admin/staff feature area. Kept here anyway since it's
// the same model/endpoint as everything else in this file.
const submitContactMessage = (
  payload: SubmitContactMessagePayload,
): Promise<ContactMessage> =>
  apiFetch('/contact/', { method: 'POST', json: payload, skipAuth: true });

export {
  deleteContactMessage,
  getContactMessage,
  listContactMessages,
  submitContactMessage,
  updateContactMessageStatus,
};
export type {
  ListContactMessagesParams,
  Paginated,
  SubmitContactMessagePayload,
};
