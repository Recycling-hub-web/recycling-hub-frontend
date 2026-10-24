import { motion } from 'framer-motion';

import { useDictionary } from '../../../hooks/useDictionary';
import { FadeIn } from '../../ui/FadeIn';
import { SectionHeading } from '../../ui/SectionHeading';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const ProblemStrip = () => {
  const { home } = useDictionary();
  const { problemStrip: content } = home;

  return (
    <section id="problem" className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-12 text-center">
          <SectionHeading
            eyebrow={content.eyebrow}
            headline={content.headline}
          />
        </div>

        {/* Stat cards */}
        <div className="mb-12 grid gap-4 sm:grid-cols-3">
          {content.stats.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: EASE }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="rounded-xl border border-slate-200 bg-neutral-50 p-5 text-center sm:p-6 md:p-8"
            >
              <div className="font-montserrat text-2xl font-extrabold text-neutral-950 sm:text-3xl md:text-4xl">
                {value}
              </div>
              <div className="mt-2 text-sm font-medium text-slate-500">
                {label}
              </div>
            </motion.div>
          ))}
        </div>

        <FadeIn delay={0.1}>
          <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-slate-500 md:text-lg">
            {content.body}
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="mx-auto mt-10 max-w-3xl rounded-xl border border-l-4 border-slate-200 border-l-brand-500 bg-slate-50 p-4 sm:p-6">
            <p className="text-sm font-medium leading-relaxed text-slate-600">
              {content.warning}
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export { ProblemStrip };
