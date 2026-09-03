'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LuArrowLeft,
  LuCalendar,
  LuMail,
  LuPencil,
  LuPhone,
  LuShieldCheck,
  LuTrash2,
} from 'react-icons/lu';

import { ApiError } from '../../../../lib/api';
import { ROLE_LABELS } from '../../../../types/auth';
import { PageContainer } from '../../../layout/PageContainer';
import { StatusBadge } from '../../../ui/badges/StatusBadge';
import { Card } from '../../../ui/card/Card';
import { AppDate } from '../../../ui/date/AppDate';
import { InfoRow } from '../../../ui/InfoRow';
import { Loading } from '../../../ui/loading/Loading';
import { ConfirmModal } from '../../../ui/modal/ConfirmModal';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
import { ROLE_BADGE_VARIANT } from '../constants';
import { useDeleteUser, useUser } from '../hooks';

const UserDetailsView = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const toast = useToast();
  const { user, loading, error, refetch } = useUser(userId);
  const { execute: deleteUser, loading: deleting } = useDeleteUser();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleConfirmDelete = async () => {
    if (!user) return;
    try {
      await deleteUser(user.id);
      toast.success('User deleted', `${user.full_name} has been removed.`);
      router.push('/admin/users');
    } catch (err) {
      toast.error(
        'Could not delete the user',
        err instanceof ApiError ? err.message : undefined,
      );
    }
  };

  if (loading) return <Loading text="Loading user…" />;

  if (error || !user) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error || 'User not found.'}{' '}
        <button
          type="button"
          onClick={refetch}
          className="font-semibold underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <PageContainer variant="form">
      <Link
        href="/admin/users"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <LuArrowLeft className="size-4" />
        Back to users
      </Link>

      <PageHeader
        title={user.full_name}
        subtitle={user.email}
        actions={
          <>
            <Link
              href={`/admin/users/${user.id}/edit`}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <LuPencil className="size-4" />
              Edit
            </Link>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              <LuTrash2 className="size-4" />
              Delete
            </button>
          </>
        }
      />

      <div className="mb-5 flex flex-wrap gap-2">
        <StatusBadge variant={ROLE_BADGE_VARIANT[user.role]}>
          {ROLE_LABELS[user.role]}
        </StatusBadge>
        <StatusBadge variant={user.is_active ? 'success' : 'neutral'}>
          {user.is_active ? 'Active' : 'Inactive'}
        </StatusBadge>
        <StatusBadge variant={user.is_2fa_enabled ? 'info' : 'neutral'}>
          {user.is_2fa_enabled ? '2FA on' : '2FA off'}
        </StatusBadge>
      </div>

      <Card className="p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow
            icon={<LuMail className="size-4" />}
            label="Email"
            value={user.email}
          />
          <InfoRow
            icon={<LuPhone className="size-4" />}
            label="Phone"
            value={user.phone_number || '—'}
          />
          <InfoRow
            icon={<LuShieldCheck className="size-4" />}
            label="Password status"
            value={user.password_reset_required ? 'Setup pending' : 'Set'}
          />
          <InfoRow
            icon={<LuCalendar className="size-4" />}
            label="Created"
            value={<AppDate value={user.created_at} format="long" />}
          />
        </div>
      </Card>

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete user"
        message={`This permanently deletes ${user.full_name}'s account and all associated data. This can't be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
        loading={deleting}
      />
    </PageContainer>
  );
};

export { UserDetailsView };
