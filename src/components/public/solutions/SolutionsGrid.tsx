import { motion } from 'framer-motion';
import Link from 'next/link';
import type { IconType } from 'react-icons';
import {
  LuBuilding2,
  LuGraduationCap,
  LuHeart,
  LuHouse,
  LuLandmark,
  LuStethoscope,
} from 'react-icons/lu';

import { SOLUTIONS } from '../../../constants/content';
import { useDictionary } from '../../../hooks/useDictionary';
import { SectionHeading } from '../../ui/SectionHeading';

const ease = [0.22, 1, 0.36, 1] as const;

type SolutionIconKey = (typeof SOLUTIONS)[number]['icon'];

export const SOLUTION_ICONS: Record<SolutionIconKey, IconType> = {
  building: LuBuilding2,
  house: LuHouse,
  landmark: LuLandmark,
  'graduation-cap': LuGraduationCap,
  stethoscope: LuStethoscope,
  heart: LuHeart,
};

type SolutionCardProps = {
  slug: string;
  icon: SolutionIconKey;
  title: string;
  summary: string;
  learnMoreLabel: string;
  featured?: boolean;
  delay?: number;
};

const SolutionCard = ({
  slug,
  icon,
  title,
  summary,
  learnMoreLabel,
  featured = false,
  delay = 0,
}: SolutionCardProps) => {
  const Icon = SOLUTION_ICONS[icon];
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease }}
      className="h-full"
    >
      <Link
        href={`/solutions/${slug}`}
        className={`group flex h-full flex-col rounded-2xl border transition-colors duration-200 ${
          featured
            ? 'border-brand-600/20 bg-brand-50 p-8 hover:border-brand-600 md:p-10'
            : 'border-slate-200 bg-neutral-50 p-6 hover:border-brand-600 hover:bg-white'
        }`}
      >
        <div
          className={`mb-5 flex items-center justify-center rounded-xl text-brand-600 ${
            featured ? 'size-14 bg-white' : 'size-12 bg-brand-50'
          }`}
        >
          <Icon size={featured ? 26 : 22} />
        </div>
        <h3
          className={`font-montserrat font-extrabold text-neutral-950 ${
            featured ? 'text-xl md:text-2xl' : 'text-base'
          }`}
        >
          {title}
        </h3>
        <p
          className={`mt-3 flex-1 leading-relaxed text-slate-500 ${
            featured ? 'text-sm md:text-base' : 'text-sm'
          }`}
        >
          {summary}
        </p>
        <p className="mt-5 text-xs font-semibold text-brand-600">
          {learnMoreLabel} →
        </p>
      </Link>
    </motion.div>
  );
};

type SolutionsGridProps = {
  excludeSlug?: string;
  variant?: 'landing' | 'compact';
};

const SolutionsGrid = ({
  excludeSlug,
  variant = 'landing',
}: SolutionsGridProps) => {
  const { solutions: content } = useDictionary();
  const solutions = SOLUTIONS.filter((s) => s.slug !== excludeSlug);
  const heading =
    variant === 'landing'
      ? content.gridHeading.ourSegments
      : content.gridHeading.exploreMore;

  if (variant === 'compact') {
    return (
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-14 text-center">
            <SectionHeading
              eyebrow={heading.eyebrow}
              headline={heading.headline}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {solutions.map(({ slug, icon }, i) => (
              <SolutionCard
                key={slug}
                slug={slug}
                icon={icon}
                title={content.cards[slug].title}
                summary={content.cards[slug].summary}
                learnMoreLabel={content.learnMore}
                delay={i * 0.06}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const featured = solutions.filter((s) => s.priority);
  const rest = solutions.filter((s) => !s.priority);

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-14 text-center">
          <SectionHeading
            eyebrow={heading.eyebrow}
            headline={heading.headline}
          />
        </div>

        {featured.length > 0 && (
          <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {featured.map(({ slug, icon }, i) => (
              <SolutionCard
                key={slug}
                slug={slug}
                icon={icon}
                title={content.cards[slug].title}
                summary={content.cards[slug].summary}
                learnMoreLabel={content.learnMore}
                featured
                delay={i * 0.08}
              />
            ))}
          </div>
        )}

        {rest.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {rest.map(({ slug, icon }, i) => (
              <SolutionCard
                key={slug}
                slug={slug}
                icon={icon}
                title={content.cards[slug].title}
                summary={content.cards[slug].summary}
                learnMoreLabel={content.learnMore}
                delay={0.16 + i * 0.06}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export { SolutionsGrid };
