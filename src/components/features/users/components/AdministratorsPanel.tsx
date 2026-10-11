'use client';

import { useState } from 'react';
import { LuCrown, LuShieldCheck } from 'react-icons/lu';

import { ApiError } from '../../../../lib/api';
import type { UserListItem } from '../../../../types/auth';
import { ConfirmModal } from '../../../ui/modal/ConfirmModal';
import { useToast } from '../../../ui/toast/ToastContext';
import { OverviewStatCard } from '../../overview/components/OverviewStatCard';
import { OverviewStatGrid } from '../../overview/components/OverviewStatGrid';
import {
  useDeleteUser,
  useResendInvite,
  useRoleLimits,
  useUpdateUser,
  useUsers,
} from '../hooks';
import { UserTable } from './UserTable';

/** Super Admin only — the one place Admin and Super Admin accounts are
 * browsed together, with usage against each role's limit. Fully
 * self-contained: owns its own toggle/delete handlers and refetches its
 * own two `useUsers` calls afterward, rather than taking callbacks from
 * a parent — it merges two independently-paginated sources client-side,
 * so a parent-owned refetch (wired to a *different* list's own data)
 * would silently never refresh this table. Not paginated: both roles
 * are capped at a handful of active accounts by design (see
 * RoleLimitSettings on the backend), so a merged, single-page list is
 * simpler than threading pagination through two sources. */
const AdministratorsPanel = () => {
  const toast = useToast();
  const [pendingDelete, setPendingDelete] = useState<UserListItem | null>(null);
  const { limits, loading: loadingLimits } = useRoleLimits();
  const {
    users: admins,
    loading: loadingAdmins,
    error: errorAdmins,
    refetch: refetchAdmins,
  } = useUsers({ page: 1, role: 'admin' });
  const {
    users: superAdmins,
    loading: loadingSuperAdmins,
    error: errorSuperAdmins,
    refetch: refetchSuperAdmins,
  } = useUsers({ page: 1, role: 'super_admin' });
  const { execute: resendInvite, loading: resendLoading } = useResendInvite();
  const { execute: updateUser } = useUpdateUser();
  const { execute: deleteUser, loading: deleting } = useDeleteUser();

  const users = [...superAdmins, ...admins];
  const loading = loadingAdmins || loadingSuperAdmins;
  const error = errorAdmins || errorSuperAdmins;

  const refetch = () => {
    refetchAdmins();
    refetchSuperAdmins();
  };

  const handleResendInvite = async (user: UserListItem) => {
    await resendInvite(user.id);
    refetch();
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
    <div>
      <OverviewStatGrid>
        <OverviewStatCard
          icon={LuShieldCheck}
          label="Admins"
          value={
            loadingLimits || !limits
              ? null
              : `${limits.admin_used} of ${limits.admin_limit}`
          }
        />
        <OverviewStatCard
          icon={LuCrown}
          label="Super Admins"
          value={
            loadingLimits || !limits
              ? null
              : `${limits.super_admin_used} of ${limits.super_admin_limit}`
          }
        />
      </OverviewStatGrid>

      <div className="mt-4">
        <UserTable
          users={users}
          count={users.length}
          page={1}
          onPageChange={() => {}}
          roleFilter=""
          loading={loading}
          error={error}
          onRetry={refetch}
          onToggleActive={handleToggleActive}
          onDeleteRequest={setPendingDelete}
          onResendInvite={handleResendInvite}
          resendLoading={resendLoading}
        />
      </div>

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
    </div>
  );
};

export { AdministratorsPanel };
