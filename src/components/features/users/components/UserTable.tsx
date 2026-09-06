'use client';

import Link from 'next/link';
import { LuEye, LuPencil, LuTrash2 } from 'react-icons/lu';

import {
  ROLE_LABELS,
  type UserListItem,
  type UserRole,
} from '../../../../types/auth';
import { StatusBadge } from '../../../ui/badges/StatusBadge';
import {
  TableEmptyRow,
  TableErrorRow,
  TableLoadingRow,
  TablePagination,
  TableWrapper,
} from '../../../ui/table';
import { ROLE_BADGE_VARIANT } from '../constants';

const COLUMN_COUNT = 5;
const PAGE_SIZE = 12;

type UserTableProps = {
  users: UserListItem[];
  count: number;
  page: number;
  onPageChange: (page: number) => void;
  roleFilter: UserRole | '';
  search?: string;
  loading: boolean;
  error: string;
  onRetry: () => void;
  onToggleActive: (user: UserListItem) => void;
  onDeleteRequest: (user: UserListItem) => void;
};

/** Pure presentational — every value it renders is a prop. Data fetching
 * and mutation calls live in the hooks (useUsers/useUpdateUser/
 * useDeleteUser), not here. */
const UserTable = ({
  users,
  count,
  page,
  onPageChange,
  roleFilter,
  search,
  loading,
  error,
  onRetry,
  onToggleActive,
  onDeleteRequest,
}: UserTableProps) => {
  const renderRows = () => {
    if (loading) return <TableLoadingRow colSpan={COLUMN_COUNT} />;
    if (error)
      return (
        <TableErrorRow
          colSpan={COLUMN_COUNT}
          message={error}
          onRetry={onRetry}
        />
      );
    if (users.length === 0) {
      let emptySubtitle: string | undefined;
      if (search) {
        emptySubtitle = `No matches for "${search}".`;
      } else if (roleFilter) {
        emptySubtitle = 'Try a different role filter.';
      }
      return (
        <TableEmptyRow
          colSpan={COLUMN_COUNT}
          title="No users found"
          subtitle={emptySubtitle}
        />
      );
    }
    return users.map((u) => (
      <tr key={u.id}>
        <td className="px-6 py-4 font-medium text-slate-900">{u.full_name}</td>
        <td className="px-6 py-4 text-slate-500">{u.email}</td>
        <td className="px-6 py-4">
          <StatusBadge variant={ROLE_BADGE_VARIANT[u.role]}>
            {ROLE_LABELS[u.role]}
          </StatusBadge>
        </td>
        <td className="px-6 py-4">
          <button type="button" onClick={() => onToggleActive(u)}>
            <StatusBadge variant={u.is_active ? 'success' : 'neutral'}>
              {u.is_active ? 'Active' : 'Inactive'}
            </StatusBadge>
          </button>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center justify-end gap-1">
            <Link
              href={`/admin/users/${u.id}`}
              aria-label={`View ${u.full_name}`}
              className="inline-flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <LuEye className="size-4" />
            </Link>
            <Link
              href={`/admin/users/${u.id}/edit`}
              aria-label={`Edit ${u.full_name}`}
              className="inline-flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <LuPencil className="size-4" />
            </Link>
            <button
              type="button"
              onClick={() => onDeleteRequest(u)}
              aria-label={`Delete ${u.full_name}`}
              className="inline-flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
            >
              <LuTrash2 className="size-4" />
            </button>
          </div>
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
          itemCount={users.length}
          totalCount={count}
          itemLabel="users"
          loading={loading}
        />
      }
    >
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Name
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Email
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Role
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Status
            </th>
            <th className="px-6 py-3 text-right font-semibold text-slate-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{renderRows()}</tbody>
      </table>
    </TableWrapper>
  );
};

export { PAGE_SIZE, UserTable };
