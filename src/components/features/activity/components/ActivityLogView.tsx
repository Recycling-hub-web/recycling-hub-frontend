'use client';

import { PageContainer } from '../../../layout/PageContainer';
import { PageHeader } from '../../../ui/PageHeader';
import { ActivityLog } from './ActivityLog';

/** System-wide, admin-only Activity Log — the same shared ActivityLog
 * component also used per-record on PickupRequestDetailsView/
 * UserDetailsView, just without an entityType/entityId so it renders
 * its own module/action/actor filters. */
const ActivityLogView = () => (
  <PageContainer variant="table">
    <PageHeader
      title="Activity Log"
      subtitle="Every logged state-changing action across the system."
    />
    <ActivityLog />
  </PageContainer>
);

export { ActivityLogView };
