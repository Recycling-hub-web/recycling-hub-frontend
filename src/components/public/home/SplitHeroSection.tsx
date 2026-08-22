import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  LuArrowUpRight,
  LuBuilding2,
  LuCheck,
  LuSmartphone,
} from 'react-icons/lu';

import { useDictionary } from '../../../hooks/useDictionary';

const ease = [0.22, 1, 0.36, 1] as const;

const SplitHeroSection = () => {
  const {
    home: { splitHero },
  } = useDictionary();
  const { individual, business } = splitHero;

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x md:divide-slate-100">
        {/* Individual panel */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease }}
          className="flex flex-col justify-center bg-white px-6 py-16 md:px-12 md:py-24 lg:px-16"
        >
          <div className="mx-auto w-full max-w-md">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-700">
              <LuSmartphone size={14} />
              {individual.badge}
            </span>
            <h2 className="font-montserrat text-4xl font-extrabold leading-[1.1] tracking-tight text-neutral-950 md:text-5xl">
              {individual.headline}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-500 md:text-lg">
              {individual.description}
            </p>

            <ul className="mt-7 flex flex-col gap-3">
              {individual.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2.5">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                    <LuCheck size={12} strokeWidth={3} />
                  </span>
                  <span className="text-sm font-medium text-neutral-800">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href={individual.ctaHref}
              className="group mt-8 inline-flex items-center gap-3 rounded-full bg-brand-600 py-3 pl-6 pr-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              {individual.cta}
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/20 transition-transform group-hover:translate-x-0.5">
                <LuArrowUpRight size={16} />
              </span>
            </Link>
          </div>
        </motion.div>

        {/* Corporate / Enterprise panel — light, brand-tinted instead of dark */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="flex flex-col justify-center bg-brand-50 px-6 py-16 md:px-12 md:py-24 lg:px-16"
        >
          <div className="mx-auto w-full max-w-md">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-700">
              <LuBuilding2 size={14} />
              {business.badge}
            </span>
            <h2 className="font-montserrat text-4xl font-extrabold leading-[1.1] tracking-tight text-neutral-950 md:text-5xl">
              {business.headline}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-600 md:text-lg">
              {business.description}
            </p>

            <ul className="mt-7 flex flex-col gap-3">
              {business.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2.5">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                    <LuCheck size={12} strokeWidth={3} />
                  </span>
                  <span className="text-sm font-medium text-neutral-800">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href={business.ctaHref}
              className="group mt-8 inline-flex items-center gap-3 rounded-full border-2 border-brand-600 bg-white py-2.5 pl-6 pr-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-600 hover:text-white"
            >
              {business.cta}
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white transition-transform group-hover:translate-x-0.5 group-hover:bg-white group-hover:text-brand-600">
                <LuArrowUpRight size={16} />
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export { SplitHeroSection };
