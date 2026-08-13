import { motion } from 'framer-motion';

import { SectionHeading } from '../../ui/SectionHeading';

const ease = [0.22, 1, 0.36, 1] as const;

const STEPS = [
  {
    number: '01',
    title: 'Request a Quote',
    description:
      'Tell us your device types, volume, and site location. No commitment required to get a number.',
  },
  {
    number: '02',
    title: 'Scheduled Collection',
    description:
      'Our SW110-compliant team collects on a timeline that fits your operations — one site or several.',
  },
  {
    number: '03',
    title: 'Certified Destruction',
    description:
      'Every data-bearing device is destroyed and documented, with a serialized certificate issued per asset.',
  },
  {
    number: '04',
    title: 'ESG Report Delivered',
    description:
      'A diversion report lands in your inbox — tonnage recycled, landfill avoided, ready for your sustainability records.',
  },
];

const ServiceProcess = () => (
  <section className="bg-neutral-50 py-16 md:py-20">
    <div className="mx-auto max-w-7xl px-5 md:px-8">
      <div className="mb-14 text-center">
        <SectionHeading
          eyebrow="For Businesses"
          headline="Bulk Collection, Start to Finish"
          subtext="Four steps from request to certified outcome — all handled by Recycling Hub."
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: i * 0.1, ease }}
            className="relative rounded-2xl border border-slate-200 bg-white p-6 md:p-7"
          >
            {/* Connector line (desktop only) */}
            {i < STEPS.length - 1 && (
              <div className="absolute -right-3 top-10 z-10 hidden h-px w-6 bg-slate-200 lg:block" />
            )}

            <span className="font-montserrat text-3xl font-black text-neutral-200 md:text-4xl">
              {step.number}
            </span>
            <h3 className="mt-3 font-montserrat text-base font-extrabold text-neutral-950">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export { ServiceProcess };
