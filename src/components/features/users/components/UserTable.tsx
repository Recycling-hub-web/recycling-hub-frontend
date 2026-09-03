'use client';

import Link from 'next/link';
import { LuTrash2 } from 'react-icons/lu';

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
      return (
        <TableEmptyRow
          colSpan={COLUMN_COUNT}
          title="No users found"
          subtitle={roleFilter ? 'Try a different role filter.' : undefined}
        />
      );
    }
    return users.map((u) => (
      <tr key={u.id}>
        <td className="px-6 py-3.5 font-medium text-slate-900">
          <Link
            href={`/admin/users/${u.id}`}
            className="hover:text-brand-600 hover:underline"
          >
            {u.full_name}
          </Link>
        </td>
        <td className="px-6 py-3.5 text-slate-500">{u.email}</td>
        <td className="px-6 py-3.5">
          <StatusBadge variant={ROLE_BADGE_VARIANT[u.role]}>
            {ROLE_LABELS[u.role]}
          </StatusBadge>
        </td>
        <td className="px-6 py-3.5">
          <button type="button" onClick={() => onToggleActive(u)}>
            <StatusBadge variant={u.is_active ? 'success' : 'neutral'}>
              {u.is_active ? 'Active' : 'Inactive'}
            </StatusBadge>
          </button>
        </td>
        <td className="px-6 py-3.5 text-right">
          <button
            type="button"
            onClick={() => onDeleteRequest(u)}
            aria-label={`Delete ${u.full_name}`}
            className="inline-flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
          >
            <LuTrash2 className="size-4" />
          </button>
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
