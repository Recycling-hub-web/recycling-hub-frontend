import { motion } from 'framer-motion';

import { useDictionary } from '../../../hooks/useDictionary';
import { FadeIn } from '../../ui/FadeIn';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const TrustStrip = () => {
  const { home } = useDictionary();

  return (
    <section className="border-b border-slate-100 bg-white py-12 md:py-14">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <FadeIn>
          <p className="mb-10 text-center text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
            {home.trustStrip.label}
          </p>
        </FadeIn>

        <div className="grid grid-cols-2 gap-y-10 md:grid-cols-4">
          {home.trustStrip.stats.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: EASE }}
              className="flex flex-col items-center gap-1 text-center"
            >
              <span className="font-montserrat text-2xl font-bold text-neutral-950 sm:text-3xl md:text-4xl lg:text-5xl">
                {value}
              </span>
              <span className="text-sm text-slate-500">{label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { TrustStrip };
