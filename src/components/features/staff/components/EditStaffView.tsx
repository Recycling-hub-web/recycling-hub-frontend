'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { LuArrowLeft } from 'react-icons/lu';

import { ApiError } from '../../../../lib/api';
import { InputField } from '../../../form/fields/InputField';
import { PageContainer } from '../../../layout/PageContainer';
import { AlertBanner } from '../../../ui/AlertBanner';
import { Button } from '../../../ui/buttons/Button';
import { Card } from '../../../ui/card/Card';
import { Loading } from '../../../ui/loading/Loading';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
import { useStaffProfile, useUpdateStaff } from '../hooks';
import { ProfilePhotoUploader } from './ProfilePhotoUploader';

type FormState = {
  department: string;
  position: string;
  branch: string;
  joining_date: string;
};

// full_name/email/phone_number live on User, not StaffProfile —
// StaffUpdateSerializer doesn't accept them at all, so they're shown
// read-only below rather than pretending they're editable here (edit
// those from the Users page's own edit form instead).
const EditStaffView = ({ staffId }: { staffId: string }) => {
  const router = useRouter();
  const toast = useToast();
  const {
    profile,
    loading: loadingProfile,
    error: loadError,
  } = useStaffProfile(staffId);
  const { execute: updateStaffMember, loading: submitting } = useUpdateStaff();
  const [formData, setFormData] = useState<FormState | null>(null);
  const [error, setError] = useState('');
  const [photoKey, setPhotoKey] = useState<string | null | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!profile) return;
    setFormData({
      department: profile.department ?? '',
      position: profile.position ?? '',
      branch: profile.branch ?? '',
      joining_date: profile.joining_date ?? '',
    });
    setPhotoKey(profile.user.profile_photo?.file_key ?? null);
  }, [profile]);

  const updateFormData = (field: string, value: string) =>
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));

  const hasChanges =
    Boolean(formData) &&
    Boolean(profile) &&
    (formData!.department !== (profile!.department ?? '') ||
      formData!.position !== (profile!.position ?? '') ||
      formData!.branch !== (profile!.branch ?? '') ||
      formData!.joining_date !== (profile!.joining_date ?? '') ||
      photoKey !== (profile!.user.profile_photo?.file_key ?? null));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData || !profile) return;
    setError('');
    try {
      await updateStaffMember(profile.id, {
        department: formData.department || undefined,
        position: formData.position || undefined,
        branch: formData.branch || undefined,
        joining_date: formData.joining_date || undefined,
        profile_photo: photoKey ?? null,
      });
      toast.success(
        'Staff profile updated',
        `${profile.user.full_name}'s employment details have been saved.`,
      );
      router.push(`/admin/staff/${profile.id}`);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not save this staff profile.',
      );
    }
  };

  if (loadingProfile) return <Loading text="Loading staff profile…" />;

  if (loadError || !profile || !formData) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {loadError || 'Staff profile not found.'}
      </div>
    );
  }

  return (
    <PageContainer variant="form">
      <Link
        href={`/admin/staff/${profile.id}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <LuArrowLeft className="size-4" />
        Back to staff profile
      </Link>

      <PageHeader
        title="Edit staff profile"
        subtitle={`${profile.user.full_name} · ${profile.employee_id}`}
      />

      <Card className="p-5">
        <form onSubmit={handleSubmit}>
          <AlertBanner message={error} />

          <div className="mb-4 grid grid-cols-1 gap-3 rounded-xl bg-slate-50 p-3.5 sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Full name
              </p>
              <p className="text-sm text-slate-700">{profile.user.full_name}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Email
              </p>
              <p className="text-sm text-slate-700">{profile.user.email}</p>
            </div>
          </div>

          <div className="grid gap-x-4 sm:grid-cols-2">
            <InputField
              label="Department"
              field="department"
              required={false}
              formData={formData}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <InputField
              label="Position"
              field="position"
              required={false}
              formData={formData}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <InputField
              label="Branch"
              field="branch"
              required={false}
              formData={formData}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <InputField
              label="Joining date"
              field="joining_date"
              type="date"
              required={false}
              formData={formData}
              updateFormData={updateFormData}
              disabled={submitting}
            />

            <div className="sm:col-span-2">
              <ProfilePhotoUploader
                value={
                  photoKey
                    ? {
                        file_key: photoKey,
                        public_url:
                          profile.user.profile_photo?.file_key === photoKey
                            ? profile.user.profile_photo?.public_url ?? null
                            : null,
                      }
                    : null
                }
                onChange={setPhotoKey}
                disabled={submitting}
              />
            </div>
          </div>

          <div className="flex gap-5 pt-5">
            <Button
              href={`/admin/staff/${profile.id}`}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || !hasChanges}
              className="flex-1"
            >
              {submitting ? 'Saving…' : 'Save changes'}
            </Button>
          </div>
        </form>
      </Card>
    </PageContainer>
  );
};

export { EditStaffView };
