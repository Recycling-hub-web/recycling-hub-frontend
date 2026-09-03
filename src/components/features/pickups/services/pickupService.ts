import { apiFetch } from '../../../../lib/api';
import type {
  PickupRequestDetails,
  PickupRequestListItem,
  PickupStatus,
} from '../types';

type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

type ListPickupRequestsParams = {
  page?: number;
  status?: PickupStatus;
};

const listPickupRequests = ({
  page = 1,
  status,
}: ListPickupRequestsParams = {}): Promise<
  Paginated<PickupRequestListItem>
> => {
  const params = new URLSearchParams({ page: String(page) });
  if (status) params.set('status', status);
  return apiFetch(`/pickups/?${params.toString()}`);
};

const getPickupRequest = (id: string): Promise<PickupRequestDetails> =>
  apiFetch(`/pickups/${id}/`);

type UpdatePickupRequestPayload = Partial<{
  pickup_address: string;
  estimated_quantity: string;
  requested_date: string;
  note: string;
}>;

// `status` is deliberately not editable here — see
// CollectionRequestUpdateSerializer's docstring on the backend; status
// only ever changes through schedule/collect/cancel below.
const updatePickupRequest = (
  id: string,
  payload: UpdatePickupRequestPayload,
): Promise<PickupRequestDetails> =>
  apiFetch(`/pickups/${id}/`, { method: 'PATCH', json: payload });

const deletePickupRequest = (id: string): Promise<void> =>
  apiFetch(`/pickups/${id}/`, { method: 'DELETE' });

type SchedulePickupPayload = {
  collector: string;
  scheduled_at: string;
  note?: string;
};

// Only valid from `pending` — see CollectionRequestDecisionService.schedule.
const schedulePickupRequest = (
  id: string,
  payload: SchedulePickupPayload,
): Promise<PickupRequestDetails> =>
  apiFetch(`/pickups/${id}/schedule/`, { method: 'POST', json: payload });

type CollectPickupPayload = {
  collected_quantity?: string;
  note?: string;
};

// Only valid from `scheduled` — see CollectionRequestDecisionService.collect.
const collectPickupRequest = (
  id: string,
  payload: CollectPickupPayload,
): Promise<PickupRequestDetails> =>
  apiFetch(`/pickups/${id}/collect/`, { method: 'POST', json: payload });

type CancelPickupPayload = {
  /** Becomes `cancellation_reason` on the backend. */
  note: string;
};

// Not valid once `collected` or already `cancelled` — see
// CollectionRequestDecisionService.cancel.
const cancelPickupRequest = (
  id: string,
  payload: CancelPickupPayload,
): Promise<PickupRequestDetails> =>
  apiFetch(`/pickups/${id}/cancel/`, { method: 'POST', json: payload });

export {
  cancelPickupRequest,
  collectPickupRequest,
  deletePickupRequest,
  getPickupRequest,
  listPickupRequests,
  schedulePickupRequest,
  updatePickupRequest,
};
export type {
  CancelPickupPayload,
  CollectPickupPayload,
  ListPickupRequestsParams,
  Paginated,
  SchedulePickupPayload,
  UpdatePickupRequestPayload,
};
