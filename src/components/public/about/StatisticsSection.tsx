import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1] as const;

const ChartBarIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
    <line x1="2" y1="20" x2="22" y2="20" />
  </svg>
);

type Stat = {
  value: string;
  label: string;
  arrow: boolean;
  filled: boolean;
};

const STATS: Stat[] = [
  {
    value: 'DOE',
    label: 'Registered E-Waste Collector',
    arrow: false,
    filled: true,
  },
  {
    value: 'Free',
    label: 'Doorstep Pickup for Individuals',
    arrow: false,
    filled: false,
  },
  {
    value: 'Instant',
    label: 'DuitNow Payment on Collection',
    arrow: false,
    filled: true,
  },
  {
    value: 'SW110',
    label: 'Compliant Bulk & Enterprise Collection',
    arrow: false,
    filled: false,
  },
];

const StatisticsSection = () => (
  <section className="bg-white py-24">
    <div className="mx-auto max-w-7xl px-5 md:px-8">
      {/* Header */}
      <div className="mb-16 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4, ease }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-500"
        >
          <ChartBarIcon />
          At a Glance
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.08, ease }}
          className="font-montserrat text-4xl font-bold tracking-tight text-neutral-950 md:text-5xl"
        >
          What You Can Count On
        </motion.h2>
      </div>

      {/* Stats grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.1, ease }}
            className={
              stat.filled
                ? 'rounded-2xl bg-neutral-950 p-8'
                : 'rounded-2xl border border-slate-200 bg-neutral-50 p-8'
            }
          >
            <p
              className={`text-5xl font-bold leading-none ${stat.filled ? 'text-white' : 'text-neutral-950'}`}
            >
              {stat.arrow && <span className="mr-0.5">↑</span>}
              {stat.value}
            </p>
            <p
              className={`mt-4 text-sm leading-relaxed ${stat.filled ? 'text-white/75' : 'text-slate-500'}`}
            >
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export { StatisticsSection };
