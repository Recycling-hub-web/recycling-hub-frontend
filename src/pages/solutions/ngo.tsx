import { AnimatePresence, motion } from 'framer-motion';
import type { ReactElement } from 'react';
import { useState } from 'react';
import {
  LuFileText,
  LuLayers,
  LuPlugZap,
  LuReceipt,
  LuTriangleAlert,
} from 'react-icons/lu';

import { Meta } from '../../components/layout/Meta';
import { ServiceProcess } from '../../components/public/services/ServiceProcess';
import { BookDemo } from '../../components/public/shared/BookDemo';
import { BeforeAfterComparison } from '../../components/solutions/BeforeAfterComparison';
import { NgoComplianceChecker } from '../../components/solutions/NgoComplianceChecker';
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
  { value: '0', label: 'Devices resold without your knowledge' },
  {
    value: '100%',
    label: 'Certified data destruction on donated devices',
  },
];

const BENEFITS = [
  {
    Icon: LuReceipt,
    title: 'ESG & Donor-Ready Reporting',
    description:
      'A diversion report you can fold directly into your own impact reporting or donor updates.',
  },
  {
    Icon: LuLayers,
    title: 'Scheduled Collection Drives',
    description:
      'Coordinate one-off collection days or ongoing pickups as donated devices come in — no minimum required.',
  },
  {
    Icon: LuFileText,
    title: 'Certified Data Destruction',
    description:
      'Every data-bearing device is wiped or destroyed to a certified standard, protecting donors and beneficiaries alike.',
  },
  {
    Icon: LuPlugZap,
    title: 'Works With However You Track Donations',
    description:
      'Spreadsheet, donation log, or no formal system at all — we build collection around what you already do.',
  },
];

const FAQ_ITEMS = [
  {
    question: 'Does this apply to NGOs and charities of any size?',
    answer:
      "Yes — whether you're a small volunteer-run group or a large registered charity, the same licensed process applies. Volume determines whether you use free individual pickup or a bulk quote.",
  },
  {
    question: 'We only have a handful of donated devices. Is that too small?',
    answer:
      "Not at all — small volumes can go through our free individual pickup with instant DuitNow payment where applicable, or bulk collection if a device is unlikely to have resale value. Get in touch and we'll point you to the right path.",
  },
  {
    question: 'What happens to data on donated devices?',
    answer:
      'Any data-bearing device — phones, laptops, drives — goes through certified destruction before recycling, whether it came from a donor or your own operations.',
  },
  {
    question: 'Can we get documentation for our own donor or impact reporting?',
    answer:
      'Yes — bulk collections include an ESG-ready diversion report you can use in donor updates, annual reports, or impact statements.',
  },
  {
    question:
      'Can you collect on a recurring basis, like after each donation drive?',
    answer:
      'Yes — we can schedule recurring pickups timed to your donation drives or set up an on-request collection whenever volume builds up.',
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

const NgoPage: NextPageWithLayout = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const toggleFaq = (i: number) => setOpenFaq(openFaq === i ? null : i);

  return (
    <>
      <Meta
        title="E-Waste Disposal for NGOs & Charities — Recycling Hub"
        description="Certified disposal and ESG reporting for donated electronics that no longer work. DOE/SW110-compliant collection for NGOs and charities across Malaysia."
      />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <ReusableHero
        eyebrow="Solutions · NGOs & Charities"
        headline="Certified E-Waste Disposal for"
        headlineAccent="NGOs & Charities."
        description="Donated electronics that no longer work still need to go somewhere responsible. Recycling Hub collects, certifies destruction on any data, and gives you an ESG-ready report for your own donor transparency."
      />

      {/* ── Mandate stats ────────────────────────────────────────────────────── */}
      <section className="border-b border-slate-100 bg-white py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <FadeIn>
            <p className="mb-10 text-center text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
              Why NGOs and charities choose licensed disposal
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

      {/* ── Bulk collection eligibility checker (NGO-only) ───────────────────── */}
      <NgoComplianceChecker />

      {/* ── Trust badges ─────────────────────────────────────────────────────── */}
      <TrustBadges />

      {/* ── Before / After ───────────────────────────────────────────────────── */}
      <BeforeAfterComparison
        eyebrow="The Reality"
        left={{
          label: 'Without Recycling Hub',
          headline: 'Stored. Unaccounted For. Unreported.',
          bullets: [
            'Unusable donated devices stored indefinitely in a back office',
            'No idea whether donor or beneficiary data was ever wiped',
            'No documentation to show donors where their contribution ended up',
            'No numbers to include in your own impact or ESG reporting',
            'Handled ad hoc, whenever someone has time',
          ],
        }}
        right={{
          label: 'With Recycling Hub',
          headline: 'Collected. Documented. Reportable.',
          bullets: [
            'Scheduled collection for unusable donated electronics',
            'Certified data destruction on every data-bearing device',
            'A licensed, SW110-compliant disposal record for your files',
            'ESG diversion report you can cite in donor or impact reporting',
            'One point of contact, not an ad hoc scramble',
          ],
        }}
      />

      {/* ── Urgency callout ──────────────────────────────────────────────────── */}
      <UrgencyCallout
        Icon={LuTriangleAlert}
        headline="Donated devices can carry someone else's data long after they've been dropped off."
        body="A donated laptop or phone often still holds the previous owner's files, accounts, or personal data. Passing it along — even to a good cause — without wiping it first is a data exposure risk for everyone involved. Recycling Hub destroys that data before the device is recycled."
      />

      {/* ── Benefits ─────────────────────────────────────────────────────────── */}
      <section className="bg-hero-gradient py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-14 text-center">
            <SectionHeading
              eyebrow="Built for NGOs & Charities"
              headline="Bulk Collection, Fully Documented"
              subtext="From a single donation drive to ongoing device turnover — Recycling Hub handles every collection so your team doesn't have to."
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
              headline="Free for Individual Drop-Offs, Quoted for Bulk"
              subtext="A handful of devices from a small drive may qualify for free individual pickup — larger volumes are quoted based on device types and count."
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
            Questions from NGOs & Charities
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
      <RelatedSolutions exclude="ngo" />

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <BookDemo />
    </>
  );
};

NgoPage.getLayout = (page: ReactElement) => <PublicLayout>{page}</PublicLayout>;

export default NgoPage;
