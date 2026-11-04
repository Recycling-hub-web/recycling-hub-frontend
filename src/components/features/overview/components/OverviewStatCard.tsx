import type { IconType } from 'react-icons';

import { StatCard } from '../../../ui/card/StatCard';

type OverviewStatCardProps = {
  icon: IconType;
  label: string;
  /** `null` renders a loading skeleton — not a real zero. A string is
   * for a pre-formatted value (currency, a route's status text). */
  value: number | string | null;
  /** Optional — when set, the whole tile is a link to that module. */
  href?: string;
};

/** One KPI tile on a role's Overview — the shared ui/card/StatCard with
 * its icon, so every dashboard's tiles look the same. */
const OverviewStatCard = ({
  icon: Icon,
  label,
  value,
  href,
}: OverviewStatCardProps) => (
  <StatCard
    icon={<Icon />}
    label={label}
    value={typeof value === 'number' ? value.toLocaleString() : value}
    href={href}
  />
);

export { OverviewStatCard };
