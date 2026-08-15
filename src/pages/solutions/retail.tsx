import { AnimatePresence, motion } from 'framer-motion';
import type { ReactElement } from 'react';
import { useState } from 'react';
import {
  LuChartBar,
  LuPackage,
  LuPlugZap,
  LuTriangleAlert,
  LuZap,
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
  {
    value: '0',
    label: 'Devices resold or landfilled without your consent',
  },
  { value: '100%', label: 'Certified data destruction on returned devices' },
];

const BENEFITS = [
  {
    Icon: LuZap,
    title: 'High-Volume Bulk Pickup',
    description:
      'Scheduled collection for hundreds of returned or end-of-life units at a time — not a one-device-at-a-time process.',
  },
  {
    Icon: LuPackage,
    title: 'Inventory Write-Off Documentation',
    description:
      'Every collected batch comes with paperwork you can hand to finance for write-offs, insurance, or audit purposes.',
  },
  {
    Icon: LuChartBar,
    title: 'Certified Destruction on Returns',
    description:
      'Devices returned under warranty or trade-in are data-wiped and destroyed to a certified standard before recycling.',
  },
  {
    Icon: LuPlugZap,
    title: 'Works With However You Track Stock',
    description:
      'Spreadsheet, POS system, or no formal tracking at all — we build the collection process around what you already do.',
  },
];

const FAQ_ITEMS = [
  {
    question: 'Does this apply to retail and trading businesses of any size?',
    answer:
      "Yes — whether you're a single outlet or a multi-branch distributor, our licensed collection process is the same. Volume is what determines timeline and quote, not business size.",
  },
  {
    question:
      'We have hundreds of returned or damaged units. Can Recycling Hub handle this?',
    answer:
      'Yes. Bulk collection is built for exactly this — hundreds of units collected, documented, and processed in scheduled runs rather than one at a time.',
  },
  {
    question:
      "What's the difference between returned devices and end-of-life stock?",
    answer:
      'Returned devices (warranty returns, trade-ins) often still carry customer data and get certified destruction as standard. End-of-life stock (damaged, obsolete, or unsellable inventory) goes straight to licensed recycling. Both are documented the same way.',
  },
  {
    question: 'Can you collect from our warehouse or multiple outlets?',
    answer:
      'Yes — bulk collection can be scheduled at a single warehouse or coordinated across multiple outlet locations, depending on your setup.',
  },
  {
    question: 'How long does collection take to arrange?',
    answer:
      "Request a quote and we'll confirm pricing and a collection window within 24 hours. Actual scheduling depends on your volume and preferred timeline.",
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

const RetailPage: NextPageWithLayout = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const toggleFaq = (i: number) => setOpenFaq(openFaq === i ? null : i);

  return (
    <>
      <Meta
        title="E-Waste Collection for Retail & Trading — Recycling Hub"
        description="Bulk collection and certified disposal for returned, damaged, and end-of-life electronics inventory. DOE/SW110-compliant, ESG-ready reporting."
      />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <ReusableHero
        eyebrow="Solutions · Retail & Trading"
        headline="Certified E-Waste Disposal for"
        headlineAccent="Retail & Trading."
        description="Returned electronics, damaged stock, and end-of-life displays pile up fast. Recycling Hub collects in bulk, destroys data on any returned devices, and gives you documentation for write-offs and ESG reporting."
      />

      {/* ── Trust badges ─────────────────────────────────────────────────────── */}
      <TrustBadges />

      {/* ── Mandate stats ────────────────────────────────────────────────────── */}
      <section className="border-b border-slate-100 bg-white py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <FadeIn>
            <p className="mb-10 text-center text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
              Why retailers and traders choose licensed bulk collection
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
          headline: 'Piling Up. Untracked. Risky.',
          bullets: [
            'Returned electronics pile up in a back room indefinitely',
            'No idea whether devices still hold customer data',
            'Damaged stock scrapped through unlicensed dealers',
            'No documentation for write-offs or insurance claims',
            'No ESG numbers to report on electronics waste',
          ],
        }}
        right={{
          label: 'With Recycling Hub',
          headline: 'Collected. Documented. Compliant.',
          bullets: [
            'Scheduled bulk pickup for returns and end-of-life stock',
            'Certified data wipe on every returned device',
            'Licensed, SW110-compliant disposal — not a scrap dealer',
            'Write-off documentation issued per collection',
            'ESG diversion report ready for your sustainability reporting',
          ],
        }}
      />

      {/* ── Urgency callout ──────────────────────────────────────────────────── */}
      <UrgencyCallout
        Icon={LuTriangleAlert}
        headline="Returned devices can still hold customer data — until they're properly wiped."
        body="A phone or laptop returned under warranty or a trade-in program often still has the previous owner's data on it. Reselling or scrapping it through an unlicensed channel is a data exposure risk, not just a compliance one. Recycling Hub wipes or destroys data on every device before it leaves our custody."
      />

      {/* ── Benefits ─────────────────────────────────────────────────────────── */}
      <section className="bg-hero-gradient py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-14 text-center">
            <SectionHeading
              eyebrow="Built for Retail & Trading"
              headline="Bulk Collection, Fully Documented"
              subtext="From single-outlet retailers to multi-branch distributors — Recycling Hub handles every collection so your team doesn't have to."
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
            Questions from Retailers & Traders
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
      <RelatedSolutions exclude="retail" />

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <BookDemo />
    </>
  );
};

RetailPage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default RetailPage;
