import Head from 'next/head';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { LuPlus } from 'react-icons/lu';

import {
  CreateUserModal,
  UserTable,
} from '../../../components/features/users/components';
import { ROLE_FILTER_OPTIONS } from '../../../components/features/users/constants';
import {
  useDeleteUser,
  useUpdateUser,
  useUsers,
} from '../../../components/features/users/hooks';
import { FilterSelect } from '../../../components/ui/FilterSelect';
import { ConfirmModal } from '../../../components/ui/modal/ConfirmModal';
import { PageHeader } from '../../../components/ui/PageHeader';
import { useToast } from '../../../components/ui/toast/ToastContext';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { ApiError } from '../../../lib/api';
import type { UserListItem, UserRole } from '../../../types/auth';
import type { NextPageWithLayout } from '../../../types/next';

const AdminUsersPage: NextPageWithLayout = () => {
  const toast = useToast();

  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('');
  const [createOpen, setCreateOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<UserListItem | null>(null);

  const { users, count, loading, error, refetch } = useUsers({
    page,
    role: roleFilter || undefined,
  });
  const { execute: updateUser } = useUpdateUser();
  const { execute: deleteUser, loading: deleting } = useDeleteUser();

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
      refetch();
    } catch (err) {
      toast.error(
        'Could not update the user',
        err instanceof ApiError ? err.message : undefined,
      );
    }
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteUser(pendingDelete.id);
      toast.success(
        'User deleted',
        `${pendingDelete.full_name} has been removed.`,
      );
      setPendingDelete(null);
      refetch();
    } catch (err) {
      toast.error(
        'Could not delete the user',
        err instanceof ApiError ? err.message : undefined,
      );
    }
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

      <UserTable
        users={users}
        count={count}
        page={page}
        onPageChange={setPage}
        roleFilter={roleFilter}
        loading={loading}
        error={error}
        onRetry={refetch}
        onToggleActive={handleToggleActive}
        onDeleteRequest={setPendingDelete}
      />

      <CreateUserModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={refetch}
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
