import { AnimatePresence, motion } from 'framer-motion';
import type { ReactElement } from 'react';
import { useState } from 'react';
import {
  LuBadgeCheck,
  LuClock,
  LuPlugZap,
  LuShieldAlert,
  LuSignature,
} from 'react-icons/lu';

import { Meta } from '../../components/layout/Meta';
import { ServiceProcess } from '../../components/public/services/ServiceProcess';
import { BookDemo } from '../../components/public/shared/BookDemo';
import { BeforeAfterComparison } from '../../components/solutions/BeforeAfterComparison';
import { RelatedSolutions } from '../../components/solutions/RelatedSolutions';
import { TrustBadges } from '../../components/solutions/TrustBadges';
import { UrgencyCallout } from '../../components/solutions/UrgencyCallout';
import { Button } from '../../components/ui/buttons/Button';
import { FadeIn } from '../../components/ui/FadeIn';
import { ReusableHero } from '../../components/ui/hero';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { PublicLayout } from '../../layouts/PublicLayout';
import type { NextPageWithLayout } from '../../types/next';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const STATS = [
  { value: 'DOE', label: 'Licensed collection and disposal' },
  { value: '0', label: 'Devices resold with client data intact' },
  {
    value: '100%',
    label: 'Certified destruction with serialized certificates',
  },
];

const BENEFITS = [
  {
    Icon: LuClock,
    title: 'Scheduled Office IT Collection',
    description:
      'Coordinate collection around your hardware refresh cycle — one office or several.',
  },
  {
    Icon: LuSignature,
    title: 'Certified Data Destruction',
    description:
      'Every device that touched client files is destroyed to a certified standard, with a certificate per asset.',
  },
  {
    Icon: LuBadgeCheck,
    title: 'PDPA-Aligned Handling',
    description:
      "Any data encountered during collection or destruction is handled only for that purpose, in line with Malaysia's PDPA.",
  },
  {
    Icon: LuPlugZap,
    title: 'Works With However You Track Assets',
    description:
      'Spreadsheet, asset register, or no formal system — we build collection around what you already do.',
  },
];

const FAQ_ITEMS = [
  {
    question: 'Does this apply to firms of any size?',
    answer:
      'Yes — from a small consultancy to a multi-branch firm, the same licensed process applies. Volume determines timeline and quote, not firm size.',
  },
  {
    question: 'How do you handle devices that held client files?',
    answer:
      'Any data-bearing device goes through certified destruction before recycling, with a serialized certificate issued per asset — proof you can show a client or regulator if asked.',
  },
  {
    question: 'Is this aligned with our confidentiality obligations?',
    answer:
      "Our data handling aligns with Malaysia's PDPA — any data encountered during collection or destruction is handled only for that purpose, not retained or resold.",
  },
  {
    question: 'Can you collect from multiple offices or branches?',
    answer:
      'Yes — collection can be scheduled at a single office or coordinated across multiple branches.',
  },
  {
    question: 'How long does collection take to arrange?',
    answer:
      "Request a quote and we'll confirm pricing and a collection window within 24 hours.",
  },
];

const ChevronIcon = ({ open }: { open: boolean }) => (
  <motion.svg
    animate={{ rotate: open ? 180 : 0 }}
    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`shrink-0 transition-colors duration-200 ${open ? 'text-brand-600' : 'text-slate-400'}`}
  >
    <polyline points="6 9 12 15 18 9" />
  </motion.svg>
);

const ProfessionalServicesPage: NextPageWithLayout = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const toggleFaq = (i: number) => setOpenFaq(openFaq === i ? null : i);

  return (
    <>
      <Meta
        title="E-Waste Disposal for Professional Services — Recycling Hub"
        description="Certified data destruction and disposal for office IT turnover — law firms, consultancies, and accounting practices. DOE/SW110-compliant, PDPA-aligned."
      />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <ReusableHero
        eyebrow="Solutions · Professional Services"
        headline="Certified E-Waste Disposal for"
        headlineAccent="Consultancies & Firms."
        description="Old laptops, servers, and office IT often carry client files long after they're retired. Recycling Hub collects in bulk, certifies data destruction, and documents every batch — without your client data ever leaving your control unverified."
      />

      {/* ── Trust badges ─────────────────────────────────────────────────────── */}
      <TrustBadges />

      {/* ── Mandate stats ────────────────────────────────────────────────────── */}
      <section className="border-b border-slate-100 bg-white py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <FadeIn>
            <p className="mb-10 text-center text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
              Why firms choose licensed, certified disposal
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {STATS.map((stat, i) => (
              <FadeIn key={stat.label} delay={i * 0.08}>
                <div className="rounded-2xl bg-hero-gradient p-8 text-center">
                  <p className="font-montserrat text-3xl font-extrabold text-white md:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm leading-snug text-white/55">
                    {stat.label}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Before / After ───────────────────────────────────────────────────── */}
      <BeforeAfterComparison
        eyebrow="The Reality"
        left={{
          label: 'Without Recycling Hub',
          headline: 'Stored. Unwiped. Exposed.',
          bullets: [
            'Retired laptops and servers stored in a cupboard indefinitely',
            'No certainty that client files were ever properly wiped',
            'Old equipment sold or scrapped through an unlicensed dealer',
            'No documentation if a client or regulator asks about disposal',
            'No ESG numbers for firm-wide sustainability reporting',
          ],
        }}
        right={{
          label: 'With Recycling Hub',
          headline: 'Collected. Destroyed. Certified.',
          bullets: [
            'Scheduled bulk collection for office IT turnover',
            'Certified destruction with a serialized certificate per device',
            'Licensed, SW110-compliant disposal — not an informal reseller',
            'Documentation ready if a client or regulator ever asks',
            "ESG diversion report for your firm's sustainability reporting",
          ],
        }}
      />

      {/* ── Urgency callout ──────────────────────────────────────────────────── */}
      <UrgencyCallout
        Icon={LuShieldAlert}
        headline="Client files don't disappear when a laptop gets retired."
        body="Case files, client financials, and confidential correspondence often sit on devices long after they're taken out of service. Reselling or scrapping that hardware through an unlicensed channel is a confidentiality risk your firm carries, not the vendor. Recycling Hub destroys that data under a certified process before anything is recycled."
      />

      {/* ── Benefits ─────────────────────────────────────────────────────────── */}
      <section className="bg-hero-gradient py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-14 text-center">
            <SectionHeading
              eyebrow="Built for Professional Services"
              headline="Bulk Collection, Fully Documented"
              subtext="From a single office refresh to a multi-branch rollout — Recycling Hub handles every collection so your team doesn't have to."
              light
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map(({ Icon, title, description }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6"
              >
                <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-white/10">
                  <Icon size={20} className="text-white/80" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-white">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-white/50">
                  {description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────────── */}
      <ServiceProcess />

      {/* ── Pricing ──────────────────────────────────────────────────────────── */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="text-center">
            <SectionHeading
              eyebrow="Pricing"
              headline="Quoted to Your Volume — No Guesswork"
              subtext="Bulk collection pricing depends on device types and volume. Tell us what you're clearing out and we'll confirm a quote before anything is scheduled."
            />
          </div>

          <FadeIn
            delay={0.15}
            className="mt-10 flex flex-col items-center gap-3"
          >
            <Button href="/contact">Request a Bulk Quote</Button>
            <p className="text-sm text-slate-500">
              No obligation · Response within 24 hours
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <h2 className="mb-12 text-center font-montserrat text-3xl font-bold leading-tight tracking-[-0.02em] text-neutral-950 md:text-4xl">
            Questions from Consultancies & Firms
          </h2>

          <div className="flex flex-col gap-3">
            {FAQ_ITEMS.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={item.question}
                  className={`rounded-xl border transition-colors duration-200 ${
                    isOpen
                      ? 'border-slate-200 bg-neutral-50'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span
                      className={`text-base font-medium leading-snug transition-colors duration-200 ${
                        isOpen ? 'text-brand-600' : 'text-slate-700'
                      }`}
                    >
                      {item.question}
                    </span>
                    <ChevronIcon open={isOpen} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: 0.28,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-slate-100 px-6 pb-6 pt-4">
                          <p className="text-sm leading-relaxed text-slate-600">
                            {item.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Related solutions ────────────────────────────────────────────────── */}
      <RelatedSolutions exclude="professional-services" />

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <BookDemo />
    </>
  );
};

ProfessionalServicesPage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default ProfessionalServicesPage;
