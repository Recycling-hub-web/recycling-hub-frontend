'use client';

import type { OperationalRole } from '../../../../layouts/operationalRoles';
import { OPERATIONAL_ROLES } from '../../../../layouts/operationalRoles';
import { RoleOverviewLayout } from './RoleOverviewLayout';

type SimpleOverviewViewProps = {
  role: OperationalRole;
};

/** Driver, Receiving Officer, and Accounting have no workflow modules
 * yet (OPERATIONAL_ROLES[role].navItems is just "Overview" today) — so
 * this renders the same shell as Admin/Staff's dashboards, just with no
 * stat grid and (for now) an empty quick-links section, which
 * RoleOverviewLayout covers with its "more is on the way" note. Once
 * any of these roles gains a real module, it starts showing up here
 * automatically — no rewrite needed, same as Admin/Staff already do. */
const SimpleOverviewView = ({ role }: SimpleOverviewViewProps) => (
  <RoleOverviewLayout
    navItems={OPERATIONAL_ROLES[role].navItems}
    ownHref={OPERATIONAL_ROLES[role].route}
  />
);

export { SimpleOverviewView };
