import { motion } from 'framer-motion';

import { SectionHeading } from '../../ui/SectionHeading';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const cardContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const cardItem = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

const ShieldIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7l-9-5z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const PlugIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 7H4a2 2 0 00-2 2v6a2 2 0 002 2h3" />
    <path d="M17 7h3a2 2 0 012 2v6a2 2 0 01-2 2h-3" />
    <line x1="7" y1="12" x2="17" y2="12" />
    <line x1="7" y1="8" x2="7" y2="16" />
    <line x1="17" y1="8" x2="17" y2="16" />
  </svg>
);

const LockIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
    <circle cx="12" cy="16" r="1" fill="currentColor" />
  </svg>
);

const FEATURES = [
  {
    Icon: ShieldIcon,
    title: 'Licensed Under DOE & SW110 — Every Collection Documented',
    body: 'Recycling Hub collects and processes e-waste under a registered DOE license and SW110 scheduled-waste compliance. Every pickup is logged, tracked, and backed by paperwork you can hand to an auditor.',
  },
  {
    Icon: PlugIcon,
    title: 'One Partner, Whether It’s One Phone or a Whole Office',
    body: "A single old laptop or a full office decommission — Recycling Hub runs the same licensed, documented process either way. You don't need a separate vendor for personal and enterprise volumes.",
  },
  {
    Icon: LockIcon,
    title: 'Certified Destruction. Zero Data Recovery.',
    body: 'Every device carrying data goes through certified destruction with a serialized certificate. Recycling Hub does not resell or retain your data-bearing devices — destruction is verified, not assumed.',
  },
];

const WhyRecyclingHub = () => (
  <section className="bg-neutral-50 py-16 md:py-20">
    <div className="mx-auto max-w-7xl px-5 md:px-8">
      <div className="mb-14 text-center">
        <SectionHeading
          eyebrow="Why Recycling Hub"
          headline="The Compliant Way to Get Rid of Old Electronics"
          subtext="A scrap dealer or a storage room won't wipe your data, document the collection, or keep it out of a landfill. Recycling Hub handles the entire process — licensed, certified, and documented — for individuals and businesses alike."
        />
      </div>

      <motion.div
        variants={cardContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        className="grid gap-6 md:grid-cols-3"
      >
        {FEATURES.map(({ Icon, title, body }) => (
          <motion.div
            key={title}
            variants={cardItem}
            className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-shadow duration-300 hover:shadow-[0_8px_40px_rgba(5,57,89,0.08)] md:p-7"
          >
            <div className="mb-5 inline-flex size-12 items-center justify-center rounded-xl bg-neutral-100 text-neutral-950 transition-colors duration-300 group-hover:bg-neutral-950 group-hover:text-white">
              <Icon />
            </div>
            <h3 className="mb-3 font-montserrat text-base font-bold leading-snug tracking-[-0.01em] text-neutral-950 md:text-lg">
              {title}
            </h3>
            <p className="text-sm leading-relaxed text-slate-500">{body}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export { WhyRecyclingHub };
