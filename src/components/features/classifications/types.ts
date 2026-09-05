import type { UserListItem } from '../../../types/auth';

// Mirrors apps.accounts.models.Classification. `name_ar`/`description_ar`
// are auto-translated and read-only on the backend (model fields are
// `editable=False`) — kept here only for display, never sent on
// create/update. Unlike Categories, there's no `is_active`/soft-delete —
// ClassificationView.destroy is a real hard delete.
type ClassificationListItem = {
  id: string;
  name: string;
  name_ar: string;
  description: string | null;
  description_ar: string | null;
};

// Detail adds who created it and when — only present on the retrieve/
// create/update endpoints (ClassificationDetailsSerializer), not on the
// list endpoint.
type Classification = ClassificationListItem & {
  assigned_at: string;
  assigned_by: UserListItem | null;
};

export type { Classification, ClassificationListItem };
