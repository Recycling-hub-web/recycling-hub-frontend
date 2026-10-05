import { apiFetch } from '../../../../lib/api';
import type { FinanceRecordListItem } from '../types';

type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

type ListFinanceRecordsParams = {
  page?: number;
};

// GET /finance/ — accounting or admin only (see FinanceRecordViewSet on
// the backend). Read-only for now, no payment workflow yet.
const listFinanceRecords = ({
  page = 1,
}: ListFinanceRecordsParams = {}): Promise<Paginated<FinanceRecordListItem>> =>
  apiFetch(`/finance/?page=${page}`);

export { listFinanceRecords };
export type { ListFinanceRecordsParams, Paginated };
