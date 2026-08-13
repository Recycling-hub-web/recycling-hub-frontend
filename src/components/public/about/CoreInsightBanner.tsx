import { motion } from 'framer-motion';
import Image from 'next/image';

import { ASSETS } from '../../../constants/content';

const ease = [0.22, 1, 0.36, 1] as const;

const CoreInsightBanner = () => (
  <section className="bg-white py-12 md:py-16">
    <div className="mx-auto max-w-7xl px-5 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#184e90] to-[#1370e2] px-8 py-12 md:px-12 md:py-16"
      >
        <div className="relative flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
          {/* Left: text */}
          <div className="max-w-xl">
            <h2 className="font-montserrat text-2xl font-bold leading-snug text-white md:text-3xl">
              Our Core Insight
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/75">
              The problem isn&apos;t your accounting software — it&apos;s the
              missing layer between your system and LHDN. We believe Malaysian
              SMEs deserve compliance that works automatically, not manually.
            </p>
          </div>

          {/* Right: Recycling Hub white icon */}
          <div className="shrink-0 opacity-90 md:pr-4">
            <Image
              src={ASSETS.logo.whiteIconBg}
              alt="Recycling Hub"
              width={240}
              height={240}
              className="object-contain"
            />
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export { CoreInsightBanner };
