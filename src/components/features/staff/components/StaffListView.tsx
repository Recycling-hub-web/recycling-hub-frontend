'use client';

import { useEffect, useState } from 'react';
import { LuDownload, LuPlus } from 'react-icons/lu';

import { ApiError } from '../../../../lib/api';
import type { UserListItem, UserRole } from '../../../../types/auth';
import { SearchInput } from '../../../form/filter/SearchInput';
import { PageContainer } from '../../../layout/PageContainer';
import { Button } from '../../../ui/buttons/Button';
import { FilterSelect } from '../../../ui/FilterSelect';
import { ConfirmModal } from '../../../ui/modal/ConfirmModal';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
import { UserTable } from '../../users/components/UserTable';
import { ROLE_FILTER_OPTIONS } from '../../users/constants';
import { useDeleteUser, useUpdateUser, useUsers } from '../../users/hooks';
import { useExportStaffReport } from '../hooks';

const SEARCH_DEBOUNCE_MS = 350;

/** Shows every account, all 5 roles — not just employment profiles for
 * role=staff — per the user's explicit request ("I want to see all
 * users into staff"). Reuses the Users feature's own list data/table/
 * actions wholesale (useUsers/UserTable/useUpdateUser/useDeleteUser),
 * same as AdminUsersView — so View/Edit/Delete here act on the User
 * account directly (Users' own routes/semantics), since a non-staff row
 * has no StaffProfile for the old staff-only actions to operate on.
 * "New staff"/Export stay Staff-specific (StaffManagementView's own
 * onboarding + Excel export), unrelated to what this list shows. */
const StaffListView = () => {
  const toast = useToast();

  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [pendingDelete, setPendingDelete] = useState<UserListItem | null>(null);

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
  const { execute: exportReport, loading: exporting } = useExportStaffReport();

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

  const handleExport = async () => {
    try {
      await exportReport();
    } catch (err) {
      toast.error(
        'Could not export the staff report',
        err instanceof ApiError ? err.message : undefined,
      );
    }
  };

  return (
    <PageContainer variant="table">
      <PageHeader
        title="Staff Management"
        subtitle="Every account — admin, staff, driver, receiving officer, and accounting."
        actions={
          <>
            <Button
              variant="secondary"
              onClick={handleExport}
              disabled={exporting}
            >
              <LuDownload className="mr-1.5 size-4" />
              {exporting ? 'Exporting…' : 'Export'}
            </Button>
            <Button href="/admin/staff/create">
              <LuPlus className="mr-1.5 size-4" />
              New staff
            </Button>
          </>
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

export { StaffListView };
