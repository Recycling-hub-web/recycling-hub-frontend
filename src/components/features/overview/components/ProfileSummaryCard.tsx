import {
  LuBriefcase,
  LuBuilding2,
  LuCalendar,
  LuIdCard,
  LuMail,
  LuPhone,
} from 'react-icons/lu';

import { useAuth } from '../../../../contexts/AuthContext';
import { Card } from '../../../ui/card/Card';
import { AppDate } from '../../../ui/date/AppDate';
import { InfoRow } from '../../../ui/InfoRow';

/** The logged-in user's own profile — extracted out of the old
 * ProfileOverview (was that component's entire content) so it's a
 * reusable piece of every role's Overview page rather than the whole
 * page. */
const ProfileSummaryCard = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
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
  );
};

export { ProfileSummaryCard };
