'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useState } from 'react';
import {
  LuBriefcase,
  LuBuilding2,
  LuCalendar,
  LuHash,
  LuKeyRound,
  LuMail,
  LuMapPin,
  LuMessageCircle,
  LuPencil,
  LuPhone,
  LuShieldCheck,
  LuUserRound,
  LuWallet,
} from 'react-icons/lu';

import { PAYOUT_METHOD_LABELS } from '../../../../constants/payoutMethods';
import { useAuth } from '../../../../contexts/AuthContext';
import { ROLE_LABELS } from '../../../../types/auth';
import { PageContainer } from '../../../layout/PageContainer';
import type { DropdownItem } from '../../../ui/buttons/ActionsDropdown';
import { ActionsDropdown } from '../../../ui/buttons/ActionsDropdown';
import { Card } from '../../../ui/card/Card';
import { InfoRow } from '../../../ui/InfoRow';
import { Loading } from '../../../ui/loading/Loading';
import { PageHeader } from '../../../ui/PageHeader';
import { DriverBankDetails } from '../../drivers/DriverBankDetails';
import { ChangeEmailModal } from './ChangeEmailModal';
import { ChangePasswordModal } from './ChangePasswordModal';
import { ProfileIdentity } from './ProfileIdentity';

const NotSet = () => (
  <span className="font-medium text-slate-400">Not set</span>
);

const Section = ({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) => (
  <Card className="p-5">
    <h2 className="text-base font-semibold text-neutral-950">{title}</h2>
    {hint && <p className="mt-1 text-sm text-slate-500">{hint}</p>}
    <div className="mt-4 flex flex-col gap-2">{children}</div>
  </Card>
);

/** /profile — the signed-in user's own profile, read-only, for every role.
 * Everything shown comes from GET /accounts/me/ (already loaded into
 * AuthContext as `user`), so it can only ever be the caller's own
 * account. Name and phone are edited on /profile/edit (EditProfileView);
 * email, role and the rest stay read-only. Work details appear only for
 * roles whose response includes a `profile` (Staff/Driver/Receiving
 * Officer/Accounting). */
const ProfileView = () => {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);

  const actionItems: DropdownItem[] = [
    {
      label: 'Edit profile',
      icon: LuPencil,
      onClick: () => router.push('/profile/edit'),
      color: 'neutral',
    },
    {
      label: 'Change email',
      icon: LuMail,
      onClick: () => setEmailOpen(true),
      color: 'neutral',
    },
    {
      label: 'Change password',
      icon: LuKeyRound,
      onClick: () => setPasswordOpen(true),
      color: 'neutral',
    },
  ];

  if (!user) return <Loading />;

  const { profile } = user;
  const joiningDate = profile?.joining_date
    ? new Date(profile.joining_date).toLocaleDateString('en-MY', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <PageContainer variant="form">
      <PageHeader
        title="My Profile"
        subtitle="Your own account details. Only you can see this page."
        actions={<ActionsDropdown items={actionItems} />}
      />

      <ProfileIdentity user={user} />

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-5">
          <Section title="Personal details">
            <InfoRow
              icon={<LuUserRound className="size-4" />}
              label="Full name"
              value={user.full_name}
            />
            <InfoRow
              icon={<LuPhone className="size-4" />}
              label="Phone number"
              value={user.phone_number || <NotSet />}
            />
            <InfoRow
              icon={<LuMessageCircle className="size-4" />}
              label="Contact on WhatsApp"
              value={user.whatsapp_enabled ? 'Yes' : 'No'}
            />
          </Section>

          <Section
            title="Account"
            hint="Change your email from Actions. Ask an administrator to change your role."
          >
            <InfoRow
              icon={<LuMail className="size-4" />}
              label="Email"
              value={user.email}
            />
            <InfoRow
              icon={<LuShieldCheck className="size-4" />}
              label="Role"
              value={ROLE_LABELS[user.role]}
            />
            <InfoRow
              icon={<LuKeyRound className="size-4" />}
              label="Two-factor authentication"
              value={user.is_2fa_enabled ? 'On' : 'Off'}
            />
          </Section>
        </div>

        {profile && (
          <div className="min-w-0">
            <Section title="Work details">
              <InfoRow
                icon={<LuHash className="size-4" />}
                label="Employee ID"
                value={profile.employee_id || <NotSet />}
              />
              <InfoRow
                icon={<LuBuilding2 className="size-4" />}
                label="Department"
                value={profile.department || <NotSet />}
              />
              <InfoRow
                icon={<LuBriefcase className="size-4" />}
                label="Position"
                value={profile.position || <NotSet />}
              />
              <InfoRow
                icon={<LuMapPin className="size-4" />}
                label="Branch"
                value={profile.branch || <NotSet />}
              />
              <InfoRow
                icon={<LuCalendar className="size-4" />}
                label="Joining date"
                value={joiningDate ?? <NotSet />}
              />
              {user.role === 'driver' && (
                <>
                  <InfoRow
                    icon={<LuWallet className="size-4" />}
                    label="Payout method"
                    value={
                      (profile.payout_method &&
                        PAYOUT_METHOD_LABELS[profile.payout_method]) || (
                        <NotSet />
                      )
                    }
                  />
                  <InfoRow
                    icon={<LuHash className="size-4" />}
                    label="Payout account"
                    value={profile.payout_account_details || <NotSet />}
                  />
                </>
              )}
            </Section>
          </div>
        )}
      </div>

      <ChangePasswordModal
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
      />
      {user.role === 'driver' && profile?.payout_details && (
        <DriverBankDetails
          details={profile.payout_details}
          canEdit
          canManageBanks={false}
          onSaved={refreshUser}
        />
      )}

      <ChangeEmailModal
        open={emailOpen}
        onClose={() => setEmailOpen(false)}
        currentEmail={user.email}
      />
    </PageContainer>
  );
};

export { ProfileView };
