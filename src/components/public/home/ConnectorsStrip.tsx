import { motion } from 'framer-motion';
import Link from 'next/link';

import { useDictionary } from '../../../hooks/useDictionary';
import { FadeIn } from '../../ui/FadeIn';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const pillContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};

const pillItem = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: EASE },
  },
};

const ConnectorsStrip = () => {
  const { home } = useDictionary();
  const { connectorsStrip: content } = home;

  return (
    <section className="border-y border-slate-100 bg-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <FadeIn>
          <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
            {content.eyebrow}
          </p>
        </FadeIn>

        <motion.div
          variants={pillContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
        >
          {content.items.map((item) => (
            <motion.span
              key={item}
              variants={pillItem}
              className="rounded-full border border-brand-100 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-600 sm:px-5 sm:py-2 sm:text-sm"
            >
              {item}
            </motion.span>
          ))}
        </motion.div>

        <FadeIn delay={0.4}>
          <p className="mt-7 text-center text-xs text-slate-500 sm:text-sm">
            {content.fallback}{' '}
            <Link
              href={content.fallbackCtaHref}
              className="font-semibold text-neutral-950 underline-offset-2 hover:underline"
            >
              {content.fallbackCtaLabel} →
            </Link>
          </p>
        </FadeIn>
      </div>
    </section>
  );
};

export { ConnectorsStrip };
