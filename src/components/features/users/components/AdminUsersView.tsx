'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LuPlus } from 'react-icons/lu';

import { ApiError } from '../../../../lib/api';
import type { UserListItem, UserRole } from '../../../../types/auth';
import { SearchInput } from '../../../form/filter/SearchInput';
import { PageContainer } from '../../../layout/PageContainer';
import { FilterSelect } from '../../../ui/FilterSelect';
import { ConfirmModal } from '../../../ui/modal/ConfirmModal';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
import { ROLE_FILTER_OPTIONS } from '../constants';
import { useDeleteUser, useUpdateUser, useUsers } from '../hooks';
import { UserTable } from './UserTable';

const SEARCH_DEBOUNCE_MS = 350;

const AdminUsersView = () => {
  const toast = useToast();

  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [pendingDelete, setPendingDelete] = useState<UserListItem | null>(null);

  // Debounced so search doesn't fire the real backend query
  // (?search=<text>, see userService.listUsers) on every keystroke.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const { users, count, loading, error, refetch } = useUsers({
    page,
    role: roleFilter || undefined,
    search: search || undefined,
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
    <PageContainer variant="table">
      <PageHeader
        title="Users"
        subtitle="Manage admin, staff, driver, receiving officer, and accounting accounts."
        actions={
          <Link
            href="/admin/users/create"
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            <LuPlus className="size-4" />
            New user
          </Link>
        }
      />

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name or email…"
          className="sm:max-w-xs"
        />
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
        search={search}
        loading={loading}
        error={error}
        onRetry={refetch}
        onToggleActive={handleToggleActive}
        onDeleteRequest={setPendingDelete}
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
    </PageContainer>
  );
};

export { AdminUsersView };
