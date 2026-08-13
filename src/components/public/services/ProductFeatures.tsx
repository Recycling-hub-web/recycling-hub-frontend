import { motion } from 'framer-motion';

import { SectionHeading } from '../../ui/SectionHeading';

const ease = [0.22, 1, 0.36, 1] as const;

const FEATURES = [
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    title: 'Full Chain-of-Custody Documentation',
    description:
      'Every device is logged at pickup and tracked through processing — you get a complete record of what happened to it, not just a receipt.',
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
    title: 'Certified Data Destruction',
    description:
      'Every data-bearing device is wiped or shredded to a certified standard, with a serialized certificate issued per asset.',
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: 'Instant Payment for Individuals',
    description:
      'Personal pickups are paid the moment your devices are collected — via DuitNow, on the spot, with no waiting period.',
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    title: 'Licensed Handling of Hazardous Components',
    description:
      'Batteries, screens, and other hazardous parts are separated and processed to DOE standard — nothing improperly discarded.',
  },
];

const ProductFeatures = () => (
  <section id="solutions" className="bg-white py-16 md:py-20">
    <div className="mx-auto max-w-7xl px-5 md:px-8">
      <div className="mb-14 text-center">
        <SectionHeading
          eyebrow="What Recycling Hub Does"
          headline="Four Things Every Collection Includes"
          subtext="Every Recycling Hub pickup includes these — no add-ons, no extra fees."
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ icon, title, description }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: i * 0.1, ease }}
            className="rounded-2xl border border-slate-200 bg-white p-6 transition-shadow duration-200 hover:shadow-md md:p-7"
          >
            <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-neutral-100 text-neutral-950">
              {icon}
            </div>
            <h3 className="font-montserrat text-sm font-extrabold text-neutral-950 md:text-base">
              {title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              {description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export { ProductFeatures };
