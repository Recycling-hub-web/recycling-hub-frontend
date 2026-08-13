import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

import { HOW_IT_WORKS } from '../../../constants/content';
import { SectionHeading } from '../../ui/SectionHeading';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ── Pastel flat icons ─────────────────────────────────────────────────────────
const ProposalIcon = () => (
  <svg viewBox="0 0 80 80" fill="none" className="size-full">
    <rect
      x="14"
      y="8"
      width="48"
      height="62"
      rx="7"
      fill="#d6ece0"
      stroke="#addac1"
      strokeWidth="3"
    />
    <rect x="24" y="18" width="28" height="4" rx="2" fill="#addac1" />
    <rect x="24" y="30" width="28" height="4" rx="2" fill="#addac1" />
    <rect x="24" y="42" width="18" height="4" rx="2" fill="#addac1" />
    <circle cx="56" cy="58" r="12" fill="#008a3e" />
    <path
      d="M50 58l4 4 7-7"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IntegrationIcon = () => (
  <svg viewBox="0 0 80 80" fill="none" className="size-full">
    <rect
      x="6"
      y="28"
      width="24"
      height="24"
      rx="6"
      fill="#d6ece0"
      stroke="#addac1"
      strokeWidth="3"
    />
    <rect
      x="50"
      y="28"
      width="24"
      height="24"
      rx="6"
      fill="#addac1"
      stroke="#52af7c"
      strokeWidth="3"
    />
    <line
      x1="30"
      y1="40"
      x2="50"
      y2="40"
      stroke="#52af7c"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeDasharray="5 4"
    />
    <circle cx="40" cy="40" r="5" fill="#008a3e" />
    <line
      x1="18"
      y1="18"
      x2="18"
      y2="28"
      stroke="#addac1"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="62"
      y1="18"
      x2="62"
      y2="28"
      stroke="#52af7c"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const GoLiveIcon = () => (
  <svg viewBox="0 0 80 80" fill="none" className="size-full">
    <path
      d="M40 8 C52 16 62 28 62 44 C62 56 53 64 40 70 C27 64 18 56 18 44 C18 28 28 16 40 8Z"
      fill="#d6ece0"
      stroke="#addac1"
      strokeWidth="3"
    />
    <circle cx="40" cy="40" r="9" fill="#008a3e" />
    <path
      d="M32 60 L26 72 L38 67Z"
      fill="#addac1"
      stroke="#addac1"
      strokeWidth="2"
    />
    <path
      d="M48 60 L54 72 L42 67Z"
      fill="#addac1"
      stroke="#addac1"
      strokeWidth="2"
    />
  </svg>
);

const ICONS = [ProposalIcon, IntegrationIcon, GoLiveIcon];

const STEP_EXTRAS = [
  {
    subtitle: 'Takes Under a Minute',
    bullets: [
      { bold: 'Online or WhatsApp', rest: ' — whichever is faster for you' },
      { bold: 'Pick a convenient time', rest: ' for doorstep collection' },
      { bold: 'No account required', rest: ' to book a pickup' },
    ],
  },
  {
    subtitle: 'Free, No Minimums',
    bullets: [
      { bold: 'Our team comes to you', rest: ' at the scheduled time' },
      { bold: 'All personal devices accepted', rest: ' in one visit' },
      { bold: 'No cost to you', rest: ' — collection is always free' },
    ],
  },
  {
    subtitle: 'On the Spot',
    bullets: [
      { bold: 'Instant DuitNow payment', rest: ' at the moment of collection' },
      { bold: 'No waiting period', rest: ' or manual payout request' },
      {
        bold: 'Your devices are recycled',
        rest: ' through certified channels',
      },
    ],
  },
];

const HowItWorks = () => {
  const timelineRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 70%', 'end 30%'],
  });

  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="how-it-works" className="bg-white py-20 md:py-32">
      <div className="mx-auto max-w-7xl rounded-3xl bg-slate-100 p-5 md:rounded-[2rem] md:p-8">
        {/* Heading */}
        <div className="mb-20 text-center md:mb-28">
          <SectionHeading
            eyebrow={HOW_IT_WORKS.eyebrow}
            headline={HOW_IT_WORKS.headline}
          />
        </div>

        {/* Steps */}
        <div ref={timelineRef} className="relative">
          {/* Growing timeline line — desktop only */}
          <div className="absolute left-[88px] top-4 hidden h-[calc(100%-2rem)] w-px bg-slate-200 md:block">
            <motion.div
              style={{ scaleY: lineScaleY, originY: 0 }}
              className="size-full bg-brand-400"
            />
          </div>

          <div className="flex flex-col gap-20 md:gap-32">
            {HOW_IT_WORKS.steps.map((step, i) => {
              const Icon = ICONS[i] ?? ProposalIcon;
              const extra = STEP_EXTRAS[i];

              return (
                <div
                  key={step.number}
                  className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16"
                >
                  {/* Left: number + icon */}
                  <motion.div
                    initial={{ opacity: 0, x: -32 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="flex items-center gap-6 md:justify-end"
                  >
                    {/* Outlined number */}
                    <span
                      className="shrink-0 font-montserrat text-[3.5rem] font-black leading-none sm:text-[5rem] md:text-[6.5rem]"
                      style={{
                        WebkitTextStroke: '1.5px rgba(15,23,42,0.18)',
                        color: 'transparent',
                      }}
                    >
                      {step.number}
                    </span>

                    {/* Icon */}
                    <div className="relative z-10 flex size-16 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm sm:size-20 md:size-24">
                      <div className="size-9 sm:size-12 md:size-14">
                        <Icon />
                      </div>
                    </div>
                  </motion.div>

                  {/* Right: title + subtitle + bullets */}
                  <motion.div
                    initial={{ opacity: 0, x: 32 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
                    className="flex flex-col justify-center"
                  >
                    <p className="mb-1 text-sm font-semibold text-slate-400">
                      {extra?.subtitle}
                    </p>
                    <h3 className="mb-5 font-montserrat text-2xl font-black uppercase tracking-tight text-slate-900 md:text-3xl">
                      {step.title}
                    </h3>

                    <ul className="space-y-3">
                      {extra?.bullets.map((b, bi) => (
                        <motion.li
                          key={bi}
                          initial={{ opacity: 0, y: 12 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: '-60px' }}
                          transition={{
                            duration: 0.45,
                            delay: 0.15 + bi * 0.08,
                            ease: EASE,
                          }}
                          className="flex items-start gap-3"
                        >
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-slate-400" />
                          <span className="text-base leading-relaxed text-slate-500">
                            <span className="font-bold text-slate-900">
                              {b.bold}
                            </span>
                            {b.rest}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export { HowItWorks };
