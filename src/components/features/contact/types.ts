// Mirrors apps.contact.models.ContactMessage on the backend.
type ContactMessageStatus = 'pending' | 'follow_up' | 'closed';

// Row shape from GET /contact/ and /contact/<id>/ (ContactMessageSerializer).
type ContactMessage = {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  submitted_at: string;
};

const CONTACT_STATUS_LABELS: Record<ContactMessageStatus, string> = {
  pending: 'Pending',
  follow_up: 'Follow-up',
  closed: 'Closed',
};

export { CONTACT_STATUS_LABELS };
export type { ContactMessage, ContactMessageStatus };
