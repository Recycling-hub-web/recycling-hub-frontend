import type { IconType } from 'react-icons';
import {
  LuFactory,
  LuFileCheck,
  LuLeaf,
  LuRecycle,
  LuShieldCheck,
  LuTruck,
} from 'react-icons/lu';

import { SERVICE_GROUPS, SERVICES } from '../../../constants/content';
import { useDictionary } from '../../../hooks/useDictionary';
import { ContentGrid } from '../shared/ContentGrid';

type ServiceIconKey = (typeof SERVICES)[number]['icon'];

export const SERVICE_ICONS: Record<ServiceIconKey, IconType> = {
  truck: LuTruck,
  factory: LuFactory,
  shield: LuShieldCheck,
  leaf: LuLeaf,
  recycle: LuRecycle,
  'file-check': LuFileCheck,
};

type ServicesGridProps = {
  excludeSlug?: string;
  variant?: 'landing' | 'compact';
};

const ServicesGrid = ({
  excludeSlug,
  variant = 'landing',
}: ServicesGridProps) => {
  const { services: content } = useDictionary();
  const services = SERVICES.filter((s) => s.slug !== excludeSlug);
  const heading =
    variant === 'landing'
      ? content.gridHeading.ourServices
      : content.gridHeading.exploreMore;

  const renderGrid = (items: typeof services, gridHeading: typeof heading) => (
    <ContentGrid
      items={items}
      icons={SERVICE_ICONS}
      cards={content.cards}
      basePath="/services"
      heading={gridHeading}
      learnMoreLabel={content.learnMore}
    />
  );

  if (variant === 'compact') return renderGrid(services, heading);

  return (
    <>
      {SERVICE_GROUPS.map(({ key, items }) => (
        <div key={key}>
          {renderGrid(
            items.filter(({ slug }) => slug !== excludeSlug),
            key === 'main' ? heading : content.supportHeading,
          )}
        </div>
      ))}
    </>
  );
};

export { ServicesGrid };
