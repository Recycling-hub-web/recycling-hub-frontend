'use client';

import { type FormEvent, useEffect, useState } from 'react';
import { LuCrown, LuShieldCheck } from 'react-icons/lu';

import { InputField } from '../../../form/fields/InputField';
import { PageContainer } from '../../../layout/PageContainer';
import { AlertBanner } from '../../../ui/AlertBanner';
import { Button } from '../../../ui/buttons/Button';
import { Card } from '../../../ui/card/Card';
import { InfoRow } from '../../../ui/InfoRow';
import { Loading } from '../../../ui/loading/Loading';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
import { useRoleLimits, useUpdateRoleLimits } from '../../users/hooks';

type FormState = {
  admin_limit: string;
  super_admin_limit: string;
};

/** Mounted at /super-admin/system — already gated to Super Admin only
 * by SuperAdminLayout (see ROUTE_ROLES['/super-admin'] in
 * middleware.ts), so this doesn't re-gate itself the way it briefly
 * did back when it lived under the shared /admin/* tree alongside
 * plain Admin pages. */
const SystemSettingsView = () => {
  const toast = useToast();
  const { limits, loading, error, refetch } = useRoleLimits();
  const { execute: updateLimits, loading: submitting } = useUpdateRoleLimits();
  const [formData, setFormData] = useState<FormState>({
    admin_limit: '',
    super_admin_limit: '',
  });
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (limits) {
      setFormData({
        admin_limit: String(limits.admin_limit),
        super_admin_limit: String(limits.super_admin_limit),
      });
    }
  }, [limits]);

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError('');
    try {
      await updateLimits({
        admin_limit: Number(formData.admin_limit),
        super_admin_limit: Number(formData.super_admin_limit),
      });
      toast.success('Role limits updated');
      refetch();
    } catch (err) {
      setApiError(
        err instanceof Error ? err.message : 'Could not update role limits.',
      );
    }
  };

  if (loading) return <Loading text="Loading system settings…" />;

  return (
    <PageContainer variant="form">
      <PageHeader
        title="System Settings"
        subtitle="Role limits and security settings for the highest-privilege accounts."
      />

      <Card className="p-5">
        <AlertBanner message={apiError || error} />

        <form onSubmit={handleSubmit} className="space-y-1">
          <div className="grid gap-x-4 sm:grid-cols-2">
            <div>
              <InputField
                label="Admin limit"
                field="admin_limit"
                type="number"
                formData={formData}
                updateFormData={updateFormData}
                disabled={submitting}
                helperText={
                  limits ? `${limits.admin_used} currently active.` : undefined
                }
              />
            </div>
            <div>
              <InputField
                label="Super Admin limit"
                field="super_admin_limit"
                type="number"
                formData={formData}
                updateFormData={updateFormData}
                disabled={submitting}
                helperText={
                  limits
                    ? `${limits.super_admin_used} currently active.`
                    : undefined
                }
              />
            </div>
          </div>

          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save limits'}
          </Button>
        </form>
      </Card>

      <Card className="mt-4 p-5">
        <p className="mb-3 text-sm font-semibold text-slate-900">Security</p>
        <InfoRow
          icon={<LuShieldCheck className="size-4" />}
          label="Two-factor authentication"
          value="Enforced for every Super Admin at login, regardless of the per-user 2FA setting — this can't be turned off for the role."
        />
        <div className="mt-3">
          <InfoRow
            icon={<LuCrown className="size-4" />}
            label="Lowering a limit"
            value="Refused if it would drop below the number of accounts already active in that role — nobody is auto-demoted or deactivated."
          />
        </div>
      </Card>
    </PageContainer>
  );
};

export { SystemSettingsView };
