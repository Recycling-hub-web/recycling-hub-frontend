import { apiFetch } from '../../../../lib/api';
import type {
  ActivityAction,
  ActivityLogEntry,
  ActivityModule,
} from '../types';

type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

type ListActivityLogParams = {
  page?: number;
  module?: ActivityModule;
  action?: ActivityAction;
  actor?: string;
  entityType?: string;
  objectId?: string;
};

// GET /audit/ — admin only (see AuditLogViewSet on the backend). Pass
// entityType+objectId together for one record's "Activity" section;
// module/action/actor filter the system-wide log.
const listActivityLog = ({
  page = 1,
  module,
  action,
  actor,
  entityType,
  objectId,
}: ListActivityLogParams = {}): Promise<Paginated<ActivityLogEntry>> => {
  const params = new URLSearchParams({ page: String(page) });
  if (module) params.set('module', module);
  if (action) params.set('action', action);
  if (actor) params.set('actor', actor);
  if (entityType) params.set('entity_type', entityType);
  if (objectId) params.set('object_id', objectId);
  return apiFetch(`/audit/?${params.toString()}`);
};

export { listActivityLog };
export type { ListActivityLogParams, Paginated };
