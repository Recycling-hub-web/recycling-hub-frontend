import { apiFetch } from '../../../../lib/api';
import type { FinanceRecordListItem, FinanceStatus } from '../types';

type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

type ListFinanceRecordsParams = {
  page?: number;
  pageSize?: number;
  status?: FinanceStatus;
};

// GET /finance/ — accounting/admin/staff see every record; a driver
// sees only their own (see FinanceRecordViewSet.get_queryset).
const listFinanceRecords = ({
  page = 1,
  pageSize,
  status,
}: ListFinanceRecordsParams = {}): Promise<
  Paginated<FinanceRecordListItem>
> => {
  const params = new URLSearchParams({ page: String(page) });
  if (pageSize) params.set('page_size', String(pageSize));
  if (status) params.set('status', status);
  return apiFetch(`/finance/?${params.toString()}`);
};

// GET /finance/{id}/ — same serializer as the list.
const getFinanceRecord = (id: string): Promise<FinanceRecordListItem> =>
  apiFetch(`/finance/${id}/`);

// POST /finance/claim-mine/ — driver only, one-click bulk claim of
// every one of their own `pending` records.
const claimMyReimbursements = (): Promise<FinanceRecordListItem[]> =>
  apiFetch('/finance/claim-mine/', { method: 'POST' });

// POST /finance/verify-reimburse/ — accounting/admin/staff, single or
// bulk. `proof`, if given, is one file key applied to every id in the
// batch (one reimbursement proof per action, not per record — same as
// the driver's own batch drop-off proof).
const verifyAndReimburse = (
  ids: string[],
  proof?: string,
): Promise<FinanceRecordListItem[]> =>
  apiFetch('/finance/verify-reimburse/', {
    method: 'POST',
    json: { ids, ...(proof && { proof }) },
  });

export {
  claimMyReimbursements,
  getFinanceRecord,
  listFinanceRecords,
  verifyAndReimburse,
};
export type { ListFinanceRecordsParams, Paginated };
