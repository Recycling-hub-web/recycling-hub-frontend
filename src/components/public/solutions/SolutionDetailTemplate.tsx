import { motion } from 'framer-motion';
import { LuCheck, LuMessageSquareQuote } from 'react-icons/lu';

import {
  SOLUTION_DETAILS,
  type SolutionSlug,
} from '../../../constants/content';
import { useDictionary } from '../../../hooks/useDictionary';
import { Button } from '../../ui/buttons/Button';
import { FadeIn } from '../../ui/FadeIn';
import { ReusableHero } from '../../ui/hero';
import { SolutionsGrid } from './SolutionsGrid';

const ease = [0.22, 1, 0.36, 1] as const;

type SolutionDetailTemplateProps = {
  slug: SolutionSlug;
};

const SolutionDetailTemplate = ({ slug }: SolutionDetailTemplateProps) => {
  const { nav, solutions: dictSolutions } = useDictionary();
  const structural = SOLUTION_DETAILS[slug];
  const { title } = dictSolutions.cards[slug];
  const details = dictSolutions.detail[slug];

  return (
    <>
      <ReusableHero
        eyebrow={nav.solutions}
        headline={title}
        description={details.framing}
      />

      {/* Why this segment chooses Recycling Hub */}
      <section className="bg-white pb-16 md:pb-20">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <FadeIn>
            <h2 className="mb-6 font-montserrat text-xl font-extrabold text-neutral-950">
              {dictSolutions.whyUsHeadingPrefix} {title}{' '}
              {dictSolutions.whyUsHeadingSuffix}
            </h2>
          </FadeIn>

          <ul className="flex flex-col gap-3">
            {details.whyUs.map((item, i) => (
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

      {/* Testimonial / case study placeholder */}
      <section className="bg-neutral-50 py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <FadeIn>
            <div className="flex items-start gap-3 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-slate-400 md:p-8">
              <LuMessageSquareQuote size={20} className="mt-0.5 shrink-0" />
              <p className="text-sm leading-relaxed">
                {details.testimonialNote}
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-16 text-center md:py-20">
        <FadeIn>
          <Button href={structural.cta.href}>{details.ctaLabel}</Button>
        </FadeIn>
      </section>

      <SolutionsGrid excludeSlug={slug} variant="compact" />
    </>
  );
};

export { SolutionDetailTemplate };
