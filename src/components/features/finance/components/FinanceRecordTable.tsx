'use client';

import { AppDate } from '../../../ui/date/AppDate';
import {
  TableEmptyRow,
  TableErrorRow,
  TableLoadingRow,
  TablePagination,
  TableWrapper,
} from '../../../ui/table';
import type { FinanceRecordListItem } from '../types';

const PAGE_SIZE = 12;

type FinanceRecordTableProps = {
  records: FinanceRecordListItem[];
  count: number;
  page: number;
  onPageChange: (page: number) => void;
  loading: boolean;
  error: string;
  onRetry: () => void;
};

/** Pure presentational, read-only — no payment workflow yet (future
 * work). One row per approved, priced pickup request. */
const FinanceRecordTable = ({
  records,
  count,
  page,
  onPageChange,
  loading,
  error,
  onRetry,
}: FinanceRecordTableProps) => {
  const columnCount = 4;

  const renderRows = () => {
    if (loading) return <TableLoadingRow colSpan={columnCount} />;
    if (error) {
      return (
        <TableErrorRow
          colSpan={columnCount}
          message={error}
          onRetry={onRetry}
        />
      );
    }
    if (records.length === 0) {
      return (
        <TableEmptyRow
          colSpan={columnCount}
          title="No finance records yet"
          subtitle="Priced, approved pickup requests will show up here."
        />
      );
    }
    return records.map((r) => (
      <tr key={r.id} className="transition-colors hover:bg-slate-50">
        <td className="px-6 py-4 font-medium text-slate-900">
          {r.collection_request.full_name}
        </td>
        <td className="px-6 py-4 text-slate-700">
          {r.collection_request.category}
        </td>
        <td className="px-6 py-4 font-medium text-slate-900">{r.price}</td>
        <td className="px-6 py-4 text-slate-500">
          <AppDate value={r.created_at} format="short" />
        </td>
      </tr>
    ));
  };

  return (
    <TableWrapper
      footer={
        <TablePagination
          currentPage={page}
          onPageChange={onPageChange}
          itemsPerPage={PAGE_SIZE}
          itemCount={records.length}
          totalCount={count}
          itemLabel="finance records"
          loading={loading}
        />
      }
    >
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Requester
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Category
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Price
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{renderRows()}</tbody>
      </table>
    </TableWrapper>
  );
};

export { FinanceRecordTable, PAGE_SIZE };
