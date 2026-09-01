'use client';

import {
  LuBriefcase,
  LuBuilding2,
  LuCalendar,
  LuIdCard,
  LuMail,
  LuPhone,
} from 'react-icons/lu';

import { useAuth } from '../../contexts/AuthContext';
import { ROLE_LABELS } from '../../types/auth';
import { Card } from '../ui/card/Card';
import { AppDate } from '../ui/date/AppDate';
import { InfoRow } from '../ui/InfoRow';
import { PageHeader } from '../ui/PageHeader';

/** The one real thing every operational role's dashboard shows today: their
 * own profile. Shared by /staff, /driver, /receiving, /accounting (and the
 * legacy generic /dashboard) rather than duplicated per role — role-specific
 * sections (assigned tasks, pickups, reports) replace the placeholder note
 * at the bottom as that workflow work gets built. */
const ProfileOverview = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      <PageHeader
        title={`Welcome, ${user.full_name.split(' ')[0]}`}
        subtitle={ROLE_LABELS[user.role]}
      />

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
          {user.profile && (
            <>
              <InfoRow
                icon={<LuIdCard className="size-4" />}
                label="Employee ID"
                value={user.profile.employee_id}
              />
              <InfoRow
                icon={<LuBuilding2 className="size-4" />}
                label="Department"
                value={user.profile.department || '—'}
              />
              <InfoRow
                icon={<LuBriefcase className="size-4" />}
                label="Position"
                value={user.profile.position || '—'}
              />
              <InfoRow
                icon={<LuCalendar className="size-4" />}
                label="Joining date"
                value={
                  <AppDate value={user.profile.joining_date} format="long" />
                }
              />
            </>
          )}
        </div>
      </Card>

      <p className="mt-6 text-sm text-slate-400">
        More of your dashboard — assigned tasks, pickups, and reports — is on
        the way.
      </p>
    </>
  );
};

export { ProfileOverview };
