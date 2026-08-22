import { motion } from 'framer-motion';

import { ABOUT_WHO_WE_WORK_WITH } from '../../../constants/content';
import { SectionHeading } from '../../ui/SectionHeading';

const ease = [0.22, 1, 0.36, 1] as const;

const WhoWeWorkWith = () => (
  <section className="bg-neutral-50 py-16 md:py-20">
    <div className="mx-auto max-w-7xl px-5 md:px-8">
      <div className="mb-12 text-center">
        <SectionHeading
          eyebrow={ABOUT_WHO_WE_WORK_WITH.eyebrow}
          headline={ABOUT_WHO_WE_WORK_WITH.headline}
        />
      </div>

      {/* Category cards */}
      <div className="mb-14 grid gap-6 sm:grid-cols-3">
        {ABOUT_WHO_WE_WORK_WITH.categories.map((cat, i) => (
          <motion.div
            key={cat.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.1, ease }}
            className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8"
          >
            <h3 className="font-montserrat text-base font-extrabold text-neutral-950">
              {cat.label}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              {cat.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Accepted device categories */}
      <div className="text-center">
        <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-slate-400">
          Accepted Device Categories
        </p>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.07 } },
          }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {ABOUT_WHO_WE_WORK_WITH.deviceCategories.map((sys) => (
            <motion.span
              key={sys}
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                show: {
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.35, ease },
                },
              }}
              className="rounded-full border border-slate-200 bg-neutral-50 px-4 py-1.5 text-sm font-semibold text-neutral-950"
            >
              {sys}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

export { WhoWeWorkWith };
