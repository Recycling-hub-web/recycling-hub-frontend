import { motion } from 'framer-motion';

import { BRAND } from '../../../constants/content';
import { Button } from '../../ui/buttons/Button';
import { FadeIn } from '../../ui/FadeIn';
import { SectionHeading } from '../../ui/SectionHeading';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const OLD_WAY = [
  'Sold to an unlicensed scrap dealer, no questions asked',
  'Left in a storage room indefinitely, taking up space',
  'Thrown in the regular bin — technically illegal, rarely enforced',
  'No idea whether the data on the device was ever wiped',
  'No paperwork if a regulator or auditor ever asks',
  'No idea where the device physically ended up',
];

const RECYCLING_HUB_WAY = [
  'Collected by a DOE-registered, SW110-compliant team',
  'Certified data destruction with a serialized certificate',
  'Full chain-of-custody from pickup to processing',
  'ESG-ready diversion report for your sustainability records',
  'Instant DuitNow payment for individual pickups',
  'A dedicated team that handles bulk collection for you',
];

const XIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path
      d="M2 2l6 6M8 2l-6 6"
      stroke="#ef4444"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path
      d="M1.5 5l2.5 2.5 4.5-4.5"
      stroke="white"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const OldWayCard = () => (
  <div className="bg-white py-16 md:py-24">
    <div className="mx-auto max-w-7xl px-5 md:px-8">
      <div className="mx-auto max-w-2xl">
        <span className="mb-4 inline-block rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-500">
          The Usual Way
        </span>
        <h3 className="font-montserrat text-2xl font-extrabold tracking-tight text-neutral-950 md:text-3xl">
          Unregulated. Untraceable. Risky.
        </h3>
        <p className="mt-2 text-sm text-slate-400">
          How most old electronics get disposed of today.
        </p>

        <div className="mt-8 h-px w-full bg-slate-100" />

        <ul className="mt-8 flex flex-col gap-4">
          {OLD_WAY.map((item, i) => (
            <motion.li
              key={item}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.06, ease: EASE }}
              className="flex items-start gap-3"
            >
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-red-50">
                <XIcon />
              </span>
              <span className="text-sm leading-relaxed text-slate-500">
                {item}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const RecyclingHubWayCard = () => (
  <div
    className="py-16 md:py-24"
    style={{ background: 'linear-gradient(145deg, #0a3d2e 0%, #008a3e 100%)' }}
  >
    <div className="mx-auto max-w-7xl px-5 md:px-8">
      <div className="mx-auto max-w-2xl">
        <span className="mb-4 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
          With Recycling Hub
        </span>
        <h3 className="font-montserrat text-2xl font-extrabold tracking-tight text-white md:text-3xl">
          Licensed. Documented. Effortless.
        </h3>
        <p className="mt-2 text-sm text-white/50">
          What you get when Recycling Hub handles it for you.
        </p>

        <div className="mt-8 h-px w-full bg-white/10" />

        <ul className="mt-8 flex flex-col gap-4">
          {RECYCLING_HUB_WAY.map((item, i) => (
            <motion.li
              key={item}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.06, ease: EASE }}
              className="flex items-start gap-3"
            >
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-white/20">
                <CheckIcon />
              </span>
              <span className="text-sm leading-relaxed text-white/80">
                {item}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const ComparisonSection = () => (
  <section className="bg-neutral-50">
    {/* Heading */}
    <div className="mx-auto max-w-7xl px-5 pb-0 pt-16 md:px-8 md:pt-20">
      <div className="text-center">
        <SectionHeading
          eyebrow="Transformation"
          headline="Stop Guessing Where It Ends Up. Start Getting Proof."
        />
      </div>
    </div>

    {/* Card 1 — sticky */}
    <div className="sticky top-20 z-[10] mt-10 overflow-hidden rounded-t-3xl">
      <OldWayCard />
    </div>

    {/* Card 2 — sticky, slides over card 1 */}
    <div className="sticky top-20 z-[15] overflow-hidden rounded-t-3xl">
      <RecyclingHubWayCard />
    </div>

    {/* CTA — slides over both cards */}
    <div className="relative z-[20] bg-neutral-50 py-16 md:py-20">
      <FadeIn className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button href="/contact" variant="primary">
          Request Bulk Quote
        </Button>
        <Button href={BRAND.whatsapp} variant="secondary">
          WhatsApp Us
        </Button>
      </FadeIn>
    </div>
  </section>
);

export { ComparisonSection };
