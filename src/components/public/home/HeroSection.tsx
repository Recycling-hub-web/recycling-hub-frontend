import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

import { HERO } from '../../../constants/content';
import { ArrowButton } from '../../ui/buttons/ArrowButton';
import { Button } from '../../ui/buttons/Button';

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease },
});

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-hero-gradient pb-0 pt-28 md:pt-36"
    >
      {/* Radial glow — center top */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[500px] -translate-x-1/2 -translate-y-1/4 animate-glow-pulse rounded-full blur-[120px] md:h-[600px] md:w-[900px]"
        style={{
          background: 'radial-gradient(ellipse, #008a3e 0%, transparent 70%)',
        }}
      />

      {/* Dot grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* ── Content — parallax up + fade on scroll ──────────────────────── */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative mx-auto max-w-7xl px-5 pb-24 text-center md:px-8 md:pb-32"
      >
        <motion.span
          {...fadeUp(0)}
          className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/80 ring-1 ring-white/20"
        >
          {HERO.badge}
        </motion.span>

        <motion.h1
          {...fadeUp(0.1)}
          className="mx-auto mt-5 max-w-4xl font-montserrat text-3xl font-extrabold leading-[1.08] tracking-[-0.03em] text-white sm:text-4xl md:text-6xl lg:text-[4.25rem]"
        >
          {HERO.headline} <br className="hidden sm:block" />
          <span className="text-white/70">{HERO.headlineAccent}</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          {...fadeUp(0.2)}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg"
        >
          {HERO.subheadline}
        </motion.p>

        {/* CTA */}
        <motion.div
          {...fadeUp(0.3)}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <ArrowButton href="/contact">{HERO.ctaPrimary}</ArrowButton>
          <Button href="/contact" variant="outline-white">
            {HERO.ctaSecondary}
          </Button>
        </motion.div>

        {/* Trust checklist */}
        <motion.ul
          {...fadeUp(0.4)}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
        >
          {HERO.trustItems.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 text-sm text-white/60"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2 7l3.5 3.5L12 3.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {item}
            </li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  );
};

export { HeroSection };
