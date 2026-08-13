import { motion } from 'framer-motion';

import { SectionHeading } from '../../ui/SectionHeading';

const ease = [0.22, 1, 0.36, 1] as const;

const PILLARS = [
  {
    title: 'DOE & SW110 Licensed',
    description:
      'Every collection and disposal is carried out under our registered DOE license and SW110 scheduled-waste compliance, kept current and audit-ready.',
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
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
  {
    title: 'Certified Data Destruction',
    description:
      'Data-bearing devices are wiped or physically destroyed to a certified standard before recycling. We do not resell devices still holding your data.',
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
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    ),
  },
  {
    title: 'PDPA Aligned',
    description:
      "Our data handling practices align with Malaysia's Personal Data Protection Act (PDPA). Any data encountered during collection or destruction is handled only for that purpose.",
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
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
];

const ComplianceSecurity = () => (
  <section className="bg-white py-16 md:py-20">
    <div className="mx-auto max-w-7xl px-5 md:px-8">
      <div className="mb-14 text-center">
        <SectionHeading
          eyebrow="Trust & Safety"
          headline="Compliance and Security Built In"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {PILLARS.map((pillar, i) => (
          <motion.div
            key={pillar.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: i * 0.1, ease }}
            className="rounded-2xl border border-slate-200 bg-neutral-50 p-6 md:p-8"
          >
            <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-neutral-100 text-neutral-950">
              {pillar.icon}
            </div>
            <h3 className="font-montserrat text-base font-extrabold text-neutral-950">
              {pillar.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              {pillar.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export { ComplianceSecurity };
