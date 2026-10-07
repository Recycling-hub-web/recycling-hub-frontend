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

// GET /finance/ — accounting/admin see every record; a driver sees only
// their own (see FinanceRecordViewSet.get_queryset on the backend).
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

// POST /finance/claim-mine/ — driver only, one-click bulk claim of
// every one of their own `pending` records.
const claimMyReimbursements = (): Promise<FinanceRecordListItem[]> =>
  apiFetch('/finance/claim-mine/', { method: 'POST' });

// POST /finance/verify-reimburse/ — accounting/admin, single or bulk.
const verifyAndReimburse = (ids: string[]): Promise<FinanceRecordListItem[]> =>
  apiFetch('/finance/verify-reimburse/', {
    method: 'POST',
    json: { ids },
  });

export { claimMyReimbursements, listFinanceRecords, verifyAndReimburse };
export type { ListFinanceRecordsParams, Paginated };
