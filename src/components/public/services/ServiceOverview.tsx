import { motion } from 'framer-motion';

import { SectionHeading } from '../../ui/SectionHeading';

const ease = [0.22, 1, 0.36, 1] as const;

const ArrowIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-slate-400"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const FlowNode = ({
  label,
  sublabel,
  accent,
  delay,
}: {
  label: string;
  sublabel: string;
  accent?: boolean;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.55, delay, ease }}
    className={`flex flex-col items-center justify-center rounded-2xl px-6 py-5 text-center sm:px-8 sm:py-7 ${
      accent
        ? 'bg-neutral-950 shadow-[0_8px_40px_rgba(0,0,0,0.25)]'
        : 'border border-slate-200 bg-white shadow-sm'
    }`}
  >
    <span
      className={`font-montserrat text-base font-extrabold sm:text-lg ${accent ? 'text-white' : 'text-neutral-950'}`}
    >
      {label}
    </span>
    <span
      className={`mt-1 text-xs sm:text-sm ${accent ? 'text-white/70' : 'text-slate-400'}`}
    >
      {sublabel}
    </span>
  </motion.div>
);

const ServiceOverview = () => (
  <section className="bg-neutral-50 py-16 md:py-20">
    <div className="mx-auto max-w-7xl px-5 md:px-8">
      <div className="mb-14 text-center">
        <SectionHeading
          eyebrow="Core Service"
          headline="One Pickup. Full Compliance."
          subtext="Recycling Hub sits between wherever your old electronics are now and a certified, documented outcome — handling collection, destruction, and reporting end to end."
        />
      </div>

      {/* Flow diagram */}
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-stretch sm:justify-between">
          <FlowNode
            label="Your Devices"
            sublabel="Individual · Office · Factory Floor"
            delay={0}
          />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15, ease }}
            className="flex items-center"
          >
            <ArrowIcon />
          </motion.div>

          <FlowNode
            label="Recycling Hub"
            sublabel="Collect · Destroy · Document · Report"
            accent
            delay={0.2}
          />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.35, ease }}
            className="flex items-center"
          >
            <ArrowIcon />
          </motion.div>

          <FlowNode
            label="Certified Outcome"
            sublabel="Compliant · Documented · Verified"
            delay={0.4}
          />
        </div>

        {/* Labels below */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5, ease }}
          className="mt-8 rounded-xl border border-slate-100 bg-neutral-50 px-6 py-4 text-center text-sm leading-relaxed text-slate-600"
        >
          No unlicensed middlemen. No missing paperwork. No landfill risk. Your
          devices go from pickup to certified disposal — fully tracked.
        </motion.div>
      </div>
    </div>
  </section>
);

export { ServiceOverview };
