'use client';

import { useEffect, useState } from 'react';
import { LuPlus } from 'react-icons/lu';

import { ApiError } from '../../../../lib/api';
import type {
  RegistrationStatus,
  UserListItem,
  UserRole,
} from '../../../../types/auth';
import { SearchInput } from '../../../form/filter/SearchInput';
import { PageContainer } from '../../../layout/PageContainer';
import { Button } from '../../../ui/buttons/Button';
import { FilterSelect } from '../../../ui/FilterSelect';
import { ConfirmModal } from '../../../ui/modal/ConfirmModal';
import { PageHeader } from '../../../ui/PageHeader';
import { Tabs } from '../../../ui/tabs';
import { useToast } from '../../../ui/toast/ToastContext';
import {
  REGISTRATION_STATUS_FILTER_OPTIONS,
  ROLE_FILTER_OPTIONS,
} from '../constants';
import {
  useDeleteUser,
  useResendInvite,
  useUpdateUser,
  useUsers,
} from '../hooks';
import { UserTable } from './UserTable';

const SEARCH_DEBOUNCE_MS = 350;

type Tab = 'users' | 'pending';

const TAB_ITEMS: { key: Tab; label: string }[] = [
  { key: 'users', label: 'Users' },
  { key: 'pending', label: 'Pending Registrations' },
];

const AdminUsersView = () => {
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<Tab>('users');
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('');
  const [registrationStatusFilter, setRegistrationStatusFilter] = useState<
    RegistrationStatus | ''
  >('');
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

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setPage(1);
  };

  // Pending Registrations is just the Users tab's own filter, pinned to
  // "pending" and surfaced as a dedicated queue rather than something an
  // admin has to remember to go select — the registration-status
  // dropdown (still useful on the Users tab for finding "expired" rows
  // specifically) would be redundant here, so it's hidden instead of
  // offering a filter that can only ever show this same tab's own data.
  const { users, count, loading, error, refetch } = useUsers({
    page,
    role: roleFilter || undefined,
    search: search || undefined,
    registrationStatus:
      activeTab === 'pending'
        ? 'pending'
        : registrationStatusFilter || undefined,
  });
  const { execute: updateUser } = useUpdateUser();
  const { execute: deleteUser, loading: deleting } = useDeleteUser();
  const { execute: resendInvite, loading: resendLoading } = useResendInvite();

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value as UserRole | '');
    setPage(1);
  };

  const handleRegistrationStatusFilterChange = (value: string) => {
    setRegistrationStatusFilter(value as RegistrationStatus | '');
    setPage(1);
  };

  const handleResendInvite = async (targetUser: UserListItem) => {
    try {
      await resendInvite(targetUser.id);
      toast.success(
        'Invite resent',
        `A new invite has been sent to ${targetUser.email}.`,
      );
      refetch();
    } catch (err) {
      // 429 (too soon) / 409 (verification cap reached) / 503 (email
      // service down) all arrive as a normal ApiError — the backend's
      // own `detail` message already says exactly which, no need to
      // branch on status here.
      toast.error(
        'Could not resend the invite',
        err instanceof ApiError ? err.message : undefined,
      );
    }
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
          <Button href="/admin/users/create">
            <LuPlus className="mr-1.5 size-4" />
            New user
          </Button>
        }
      />

      <Tabs
        tabs={TAB_ITEMS}
        active={activeTab}
        onChange={handleTabChange}
        className="-mt-2 mb-4 px-0"
      />

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name or email…"
          className="sm:max-w-xs"
        />
        <div className="flex gap-2">
          <FilterSelect
            value={roleFilter}
            onChange={handleRoleFilterChange}
            options={ROLE_FILTER_OPTIONS}
          />
          {activeTab === 'users' && (
            <FilterSelect
              value={registrationStatusFilter}
              onChange={handleRegistrationStatusFilterChange}
              options={REGISTRATION_STATUS_FILTER_OPTIONS}
            />
          )}
        </div>
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
        onResendInvite={handleResendInvite}
        resendLoading={resendLoading}
        variant={activeTab === 'pending' ? 'pending' : 'default'}
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
