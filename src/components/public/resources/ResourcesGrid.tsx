import type { IconType } from 'react-icons';
import {
  LuBadgeCheck,
  LuFactory,
  LuFileCheck,
  LuLeaf,
  LuLock,
  LuTruck,
} from 'react-icons/lu';

import { RESOURCES } from '../../../constants/content';
import { useDictionary } from '../../../hooks/useDictionary';
import { ContentGrid } from '../shared/ContentGrid';

type ResourceIconKey = (typeof RESOURCES)[number]['icon'];

export const RESOURCE_ICONS: Record<ResourceIconKey, IconType> = {
  'badge-check': LuBadgeCheck,
  factory: LuFactory,
  lock: LuLock,
  leaf: LuLeaf,
  truck: LuTruck,
  'file-check': LuFileCheck,
};

type ResourcesGridProps = {
  excludeSlug?: string;
  variant?: 'landing' | 'compact';
};

const ResourcesGrid = ({
  excludeSlug,
  variant = 'landing',
}: ResourcesGridProps) => {
  const { resources: content } = useDictionary();
  const resources = RESOURCES.filter((r) => r.slug !== excludeSlug);
  const heading =
    variant === 'landing'
      ? content.gridHeading.ourResources
      : content.gridHeading.exploreMore;

  return (
    <ContentGrid
      items={resources}
      icons={RESOURCE_ICONS}
      cards={content.cards}
      basePath="/resources"
      heading={heading}
      learnMoreLabel={content.learnMore}
    />
  );
};

export { ResourcesGrid };
