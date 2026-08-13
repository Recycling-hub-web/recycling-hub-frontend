import { motion } from 'framer-motion';

type ReusableHeroProps = {
  eyebrow?: string;
  headline: string;
  headlineAccent?: string;
  description?: string;
};

const ease = [0.22, 1, 0.36, 1] as const;

const ReusableHero = ({
  eyebrow,
  headline,
  headlineAccent,
  description,
}: ReusableHeroProps) => (
  <section className="relative overflow-hidden bg-hero-gradient pb-16 pt-[calc(70px+2.5rem)] md:pb-20 md:pt-[calc(80px+3.5rem)]">
    {/* Radial glow */}
    <div
      className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/3 animate-glow-pulse rounded-full blur-[120px]"
      style={{
        background: 'radial-gradient(ellipse, #008a3e 0%, transparent 70%)',
      }}
    />

    {/* Line grid */}
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
    />

    <div className="relative mx-auto max-w-4xl px-5 text-center md:px-8">
      {eyebrow && (
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease }}
          className="mb-5 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/70 backdrop-blur-sm"
        >
          {eyebrow}
        </motion.span>
      )}

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="font-montserrat text-4xl font-extrabold leading-[1.1] tracking-[-0.03em] text-white sm:text-5xl md:text-6xl lg:text-[3.75rem]"
      >
        {headline}
        {headlineAccent && (
          <>
            {' '}
            <span className="text-white/60">{headlineAccent}</span>
          </>
        )}
      </motion.h1>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.35, ease }}
          className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/60 md:mt-8 md:text-lg"
        >
          {description}
        </motion.p>
      )}
    </div>
  </section>
);

export { ReusableHero };
export type { ReusableHeroProps };
