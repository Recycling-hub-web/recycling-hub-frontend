'use client';

import {
  LuBriefcase,
  LuBuilding2,
  LuCalendar,
  LuIdCard,
  LuMail,
  LuPhone,
} from 'react-icons/lu';

import { useAuth } from '../../../../contexts/AuthContext';
import { usePortalLocale } from '../../../../contexts/PortalLocaleContext';
import { Card } from '../../../ui/card/Card';
import { AppDate } from '../../../ui/date/AppDate';
import { InfoRow } from '../../../ui/InfoRow';

/** The logged-in user's own profile — extracted out of the old
 * ProfileOverview (was that component's entire content) so it's a
 * reusable piece of every role's Overview page rather than the whole
 * page. */
const ProfileSummaryCard = () => {
  const { t, locale } = usePortalLocale();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Card className="p-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <InfoRow
          icon={<LuMail className="size-4" />}
          label={t('Email')}
          value={user.email}
        />
        <InfoRow
          icon={<LuPhone className="size-4" />}
          label={t('Phone')}
          value={user.phone_number || '—'}
        />
        {user.profile && (
          <>
            <InfoRow
              icon={<LuIdCard className="size-4" />}
              label={t('Employee ID')}
              value={user.profile.employee_id}
            />
            <InfoRow
              icon={<LuBuilding2 className="size-4" />}
              label={t('Department')}
              value={user.profile.department || '—'}
            />
            <InfoRow
              icon={<LuBriefcase className="size-4" />}
              label={t('Position')}
              value={user.profile.position || '—'}
            />
            <InfoRow
              icon={<LuCalendar className="size-4" />}
              label={t('Joining date')}
              value={
                <AppDate
                  value={user.profile.joining_date}
                  format="long"
                  locale={locale === 'bm' ? 'ms-MY' : 'en-GB'}
                />
              }
            />
          </>
        )}
      </div>
    </Card>
  );
};

export { ProfileSummaryCard };
