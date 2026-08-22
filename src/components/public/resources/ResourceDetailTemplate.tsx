import { motion } from 'framer-motion';
import { LuCheck } from 'react-icons/lu';

import type { ResourceSlug } from '../../../constants/content';
import { useDictionary } from '../../../hooks/useDictionary';
import { Button } from '../../ui/buttons/Button';
import { FadeIn } from '../../ui/FadeIn';
import { ReusableHero } from '../../ui/hero';
import { ResourcesGrid } from './ResourcesGrid';

const ease = [0.22, 1, 0.36, 1] as const;

type ResourceDetailTemplateProps = {
  slug: ResourceSlug;
};

const ResourceDetailTemplate = ({ slug }: ResourceDetailTemplateProps) => {
  const { nav, resources: dictResources } = useDictionary();
  const { title } = dictResources.cards[slug];
  const details = dictResources.detail[slug];

  return (
    <>
      <ReusableHero
        eyebrow={nav.resources}
        headline={title}
        description={details.description}
      />

      {/* Key points */}
      <section className="bg-white pb-16 md:pb-20">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <ul className="flex flex-col gap-3">
            {details.keyPoints.map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.06, ease }}
                className="flex items-start gap-3 rounded-xl border border-slate-100 bg-neutral-50 px-5 py-4"
              >
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  <LuCheck size={12} strokeWidth={3} />
                </span>
                <span className="text-sm leading-relaxed text-slate-700">
                  {item}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* Takeaway */}
      <section className="bg-neutral-50 py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <FadeIn>
            <p className="rounded-2xl border-l-4 border-brand-600 bg-white p-6 text-sm font-semibold leading-relaxed text-neutral-950 md:p-8 md:text-base">
              {details.takeaway}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-16 text-center md:py-20">
        <FadeIn>
          <Button href="/contact">{dictResources.ctaLabel}</Button>
        </FadeIn>
      </section>

      <ResourcesGrid excludeSlug={slug} variant="compact" />
    </>
  );
};

export { ResourceDetailTemplate };
