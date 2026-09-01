import Head from 'next/head';
import type { ReactElement } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { LuPlus, LuTrash2 } from 'react-icons/lu';

import { CreateUserModal } from '../../../components/admin/CreateUserModal';
import { StatusBadge } from '../../../components/ui/badges/StatusBadge';
import type { BadgeVariant } from '../../../components/ui/badges/variants';
import { FilterSelect } from '../../../components/ui/FilterSelect';
import { ConfirmModal } from '../../../components/ui/modal/ConfirmModal';
import { PageHeader } from '../../../components/ui/PageHeader';
import {
  TableEmptyRow,
  TableErrorRow,
  TableLoadingRow,
  TablePagination,
  TableWrapper,
} from '../../../components/ui/table';
import { useToast } from '../../../components/ui/toast/ToastContext';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { ApiError } from '../../../lib/api';
import {
  deleteUser,
  listUsers,
  updateUser,
} from '../../../services/userService';
import {
  ROLE_LABELS,
  type UserListItem,
  type UserRole,
} from '../../../types/auth';
import type { NextPageWithLayout } from '../../../types/next';

const ROLE_FILTER_OPTIONS = [
  { value: '', label: 'All roles' },
  ...(Object.keys(ROLE_LABELS) as UserRole[]).map((role) => ({
    value: role,
    label: ROLE_LABELS[role],
  })),
];

const ROLE_BADGE_VARIANT: Record<UserRole, BadgeVariant> = {
  admin: 'danger',
  staff: 'info',
  driver: 'success',
  receiving_officer: 'warning',
  accounting: 'attention',
  resident: 'neutral',
};

const COLUMN_COUNT = 5;

const AdminUsersPage: NextPageWithLayout = () => {
  const toast = useToast();

  const [users, setUsers] = useState<UserListItem[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<UserListItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const PAGE_SIZE = 12;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listUsers({ page, role: roleFilter || undefined });
      setUsers(data.results);
      setCount(data.count);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load users.');
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value as UserRole | '');
    setPage(1);
  };

  const handleToggleActive = async (targetUser: UserListItem) => {
    try {
      await updateUser(targetUser.id, { is_active: !targetUser.is_active });
      toast.success(
        targetUser.is_active ? 'User deactivated' : 'User activated',
      );
      fetchUsers();
    } catch (err) {
      toast.error(
        'Could not update the user',
        err instanceof ApiError ? err.message : undefined,
      );
    }
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteUser(pendingDelete.id);
      toast.success(
        'User deleted',
        `${pendingDelete.full_name} has been removed.`,
      );
      setPendingDelete(null);
      fetchUsers();
    } catch (err) {
      toast.error(
        'Could not delete the user',
        err instanceof ApiError ? err.message : undefined,
      );
    } finally {
      setDeleting(false);
    }
  };

  const renderTableRows = () => {
    if (loading) return <TableLoadingRow colSpan={COLUMN_COUNT} />;
    if (error) {
      return (
        <TableErrorRow
          colSpan={COLUMN_COUNT}
          message={error}
          onRetry={fetchUsers}
        />
      );
    }
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
          {u.full_name}
        </td>
        <td className="px-6 py-3.5 text-slate-500">{u.email}</td>
        <td className="px-6 py-3.5">
          <StatusBadge variant={ROLE_BADGE_VARIANT[u.role]}>
            {ROLE_LABELS[u.role]}
          </StatusBadge>
        </td>
        <td className="px-6 py-3.5">
          <button type="button" onClick={() => handleToggleActive(u)}>
            <StatusBadge variant={u.is_active ? 'success' : 'neutral'}>
              {u.is_active ? 'Active' : 'Inactive'}
            </StatusBadge>
          </button>
        </td>
        <td className="px-6 py-3.5 text-right">
          <button
            type="button"
            onClick={() => setPendingDelete(u)}
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
    <>
      <Head>
        <title>Users — Recycling Hub Admin</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <PageHeader
        title="Users"
        subtitle="Manage admin, staff, driver, receiving officer, and accounting accounts."
        actions={
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            <LuPlus className="size-4" />
            New user
          </button>
        }
      />

      <div className="mb-4 flex justify-end">
        <FilterSelect
          value={roleFilter}
          onChange={handleRoleFilterChange}
          options={ROLE_FILTER_OPTIONS}
        />
      </div>

      <TableWrapper
        footer={
          <TablePagination
            currentPage={page}
            onPageChange={setPage}
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
          <tbody className="divide-y divide-slate-100">
            {renderTableRows()}
          </tbody>
        </table>
      </TableWrapper>

      <CreateUserModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={fetchUsers}
      />

      <ConfirmModal
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete user"
        message={`This permanently deletes ${pendingDelete?.full_name}'s account and all associated data. This can't be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
        loading={deleting}
      />
    </>
  );
};

AdminUsersPage.getLayout = (page: ReactElement) => (
  <AdminLayout>{page}</AdminLayout>
);

export default AdminUsersPage;
