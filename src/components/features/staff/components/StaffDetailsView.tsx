'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LuArrowLeft,
  LuBriefcase,
  LuBuilding2,
  LuCalendar,
  LuIdCard,
  LuMail,
  LuPencil,
  LuPhone,
  LuTrash2,
  LuUser,
} from 'react-icons/lu';

import { ApiError } from '../../../../lib/api';
import { PageContainer } from '../../../layout/PageContainer';
import type { DropdownItem } from '../../../ui/buttons/ActionsDropdown';
import { ActionsDropdown } from '../../../ui/buttons/ActionsDropdown';
import { Card } from '../../../ui/card/Card';
import { AppDate } from '../../../ui/date/AppDate';
import { InfoRow } from '../../../ui/InfoRow';
import { Loading } from '../../../ui/loading/Loading';
import { ConfirmModal } from '../../../ui/modal/ConfirmModal';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
import { useDeleteStaff, useStaffProfile } from '../hooks';

const ARABIC_FIELDS: {
  label: string;
  key: 'department_ar' | 'position_ar' | 'branch_ar';
}[] = [
  { label: 'Department', key: 'department_ar' },
  { label: 'Position', key: 'position_ar' },
  { label: 'Branch', key: 'branch_ar' },
];

const StaffDetailsView = ({ staffId }: { staffId: string }) => {
  const router = useRouter();
  const toast = useToast();
  const { profile, loading, error, refetch } = useStaffProfile(staffId);
  const { execute: deleteStaffMember, loading: deleting } = useDeleteStaff();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleConfirmDelete = async () => {
    if (!profile) return;
    try {
      await deleteStaffMember(profile.id);
      toast.success(
        'Staff profile deleted',
        `"${profile.user.full_name}" has been removed from staff.`,
      );
      router.push('/admin/staff');
    } catch (err) {
      toast.error(
        'Could not delete this staff profile',
        err instanceof ApiError ? err.message : undefined,
      );
    }
  };

  if (loading) return <Loading text="Loading staff profile…" />;

  if (error || !profile) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error || 'Staff profile not found.'}{' '}
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

  const actionItems: DropdownItem[] = [
    {
      label: 'Edit',
      icon: LuPencil,
      onClick: () => router.push(`/admin/staff/${profile.id}/edit`),
      color: 'neutral',
    },
    {
      label: 'Delete',
      icon: LuTrash2,
      onClick: () => setConfirmOpen(true),
      color: 'danger',
    },
  ];

  const hasArabicTranslation = ARABIC_FIELDS.some((f) => profile[f.key]);

  return (
    <PageContainer variant="form">
      <Link
        href="/admin/staff"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <LuArrowLeft className="size-4" />
        Back to staff
      </Link>

      <PageHeader
        title={profile.user.full_name}
        subtitle={profile.employee_id}
        actions={<ActionsDropdown items={actionItems} />}
      />

      <div className="mb-5 flex items-center gap-3">
        {profile.user.profile_photo?.public_url ? (
          // eslint-disable-next-line @next/next/no-img-element -- remote/presigned URL, not a static asset
          <img
            src={profile.user.profile_photo.public_url}
            alt=""
            className="size-14 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <LuUser className="size-6" />
          </span>
        )}
      </div>

      <Card className="p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow
            icon={<LuMail className="size-4" />}
            label="Email"
            value={profile.user.email}
          />
          <InfoRow
            icon={<LuPhone className="size-4" />}
            label="Phone"
            value={profile.user.phone_number || '—'}
          />
          <InfoRow
            icon={<LuBuilding2 className="size-4" />}
            label="Department"
            value={profile.department || '—'}
          />
          <InfoRow
            icon={<LuBriefcase className="size-4" />}
            label="Position"
            value={profile.position || '—'}
          />
          <InfoRow
            icon={<LuIdCard className="size-4" />}
            label="Branch"
            value={profile.branch || '—'}
          />
          <InfoRow
            icon={<LuCalendar className="size-4" />}
            label="Joining date"
            value={
              profile.joining_date ? (
                <AppDate value={profile.joining_date} format="long" />
              ) : (
                '—'
              )
            }
          />
        </div>

        {hasArabicTranslation && (
          <div className="mt-5 border-t border-slate-100 pt-5">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Arabic translation (auto-generated)
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {ARABIC_FIELDS.filter((f) => profile[f.key]).map((f) => (
                <div key={f.key}>
                  <p className="text-xs text-slate-400">{f.label}</p>
                  <p dir="rtl" className="text-sm text-slate-700">
                    {profile[f.key]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete staff profile"
        message={`This permanently deletes "${profile.user.full_name}"'s staff profile (employee ID, department, position, branch). Their user account is not deleted.`}
        confirmText="Delete"
        confirmVariant="danger"
        loading={deleting}
      />
    </PageContainer>
  );
};

export { StaffDetailsView };
