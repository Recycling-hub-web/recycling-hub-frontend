import type { IconType } from 'react-icons';
import {
  LuFactory,
  LuFileCheck,
  LuLeaf,
  LuRecycle,
  LuShieldCheck,
  LuTruck,
} from 'react-icons/lu';

import { SERVICES } from '../../../constants/content';
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

  return (
    <ContentGrid
      items={services}
      icons={SERVICE_ICONS}
      cards={content.cards}
      basePath="/services"
      heading={heading}
      learnMoreLabel={content.learnMore}
    />
  );
};

export { ServicesGrid };
