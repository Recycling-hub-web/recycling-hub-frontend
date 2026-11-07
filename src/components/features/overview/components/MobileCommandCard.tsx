import Link from 'next/link';
import { LuArrowUpRight, LuPlus, LuRadar, LuTruck } from 'react-icons/lu';

import type { NavItem } from '../../../ui/navigation';

type Props = { navItems: NavItem[] };

const MobileCommandCard = ({ navItems }: Props) => {
  const pages = navItems.flatMap((item) =>
    item.children?.length ? item.children : [item],
  );
  const requests = pages.find((item) => item.href.endsWith('/pickup-requests'));
  const work = pages.find((item) =>
    /\/(pickups|deliveries|finance)$/.test(item.href),
  );
  if (!requests && !work) return null;
  return (
    <section
      className="system-command-card mb-6 lg:hidden"
      aria-label="Pickup command center"
    >
      <div className="mb-5 flex items-center gap-2 text-xs font-medium text-white/75">
        <LuRadar size={16} /> YOUR COMMAND CENTER
      </div>
      <h2 className="max-w-64 text-2xl font-bold leading-tight">
        {requests
          ? 'Good things start with a pickup.'
          : 'Your next move, within reach.'}
      </h2>
      <p className="mt-2 max-w-64 text-sm leading-relaxed text-white/75">
        {requests
          ? 'Book collections. Follow progress. Keep e-waste moving.'
          : 'Stay on top of your work and keep collections moving.'}
      </p>
      <div className="mt-5 flex gap-3">
        {requests && (
          <Link
            href={`${requests.href}/create`}
            className="system-command-primary"
          >
            <LuPlus size={18} /> Book pickup
          </Link>
        )}
        <Link
          href={requests?.href ?? work!.href}
          className={
            requests ? 'system-command-secondary' : 'system-command-primary'
          }
        >
          {requests ? <LuTruck size={18} /> : <LuArrowUpRight size={18} />}
          {requests ? 'Track' : work!.label}
        </Link>
      </div>
      <LuTruck className="system-command-watermark" aria-hidden="true" />
    </section>
  );
};

export { MobileCommandCard };
