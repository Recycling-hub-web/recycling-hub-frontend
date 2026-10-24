import { motion } from 'framer-motion';
import Link from 'next/link';
import type { IconType } from 'react-icons';

import { SectionHeading } from '../../ui/SectionHeading';

const ease = [0.22, 1, 0.36, 1] as const;

type ContentGridItem = { slug: string; icon: string };

type ContentGridProps = {
  items: readonly ContentGridItem[];
  icons: Record<string, IconType>;
  cards: Record<string, { title: string; summary: string }>;
  basePath: string;
  heading: { eyebrow: string; headline: string };
  learnMoreLabel: string;
};

/** Shared card-grid section for /services, /resources (and any future index
 * listing that links out to per-slug detail pages). Each page supplies its
 * own data source, icon map, and route prefix so the layout/animation/card
 * markup isn't copy-pasted per page. */
const ContentGrid = ({
  items,
  icons,
  cards,
  basePath,
  heading,
  learnMoreLabel,
}: ContentGridProps) => (
  <section className="bg-white py-16 md:py-20">
    <div className="mx-auto max-w-7xl px-5 md:px-8">
      <div className="mb-14 text-center">
        <SectionHeading eyebrow={heading.eyebrow} headline={heading.headline} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ slug, icon }, i) => {
          const Icon = icons[icon];
          const { title, summary } = cards[slug]!;
          return (
            <motion.div
              key={slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.06, ease }}
            >
              <Link
                href={`${basePath}/${slug}`}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-neutral-50 p-6 transition-colors duration-200 hover:border-brand-600 hover:bg-white md:p-8"
              >
                <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  {Icon && <Icon size={22} />}
                </div>
                <h3 className="font-montserrat text-base font-extrabold text-neutral-950">
                  {title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-500">
                  {summary}
                </p>
                <p className="mt-5 text-xs font-semibold text-brand-600">
                  {learnMoreLabel} →
                </p>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export { ContentGrid };
export type { ContentGridProps };
