import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

interface TabData {
  label: string;
  headline: string;
  checklist: string[];
  quote: string;
  authorInitials: string;
  authorLabel: string;
  authorRole: string;
  mockupLabel: string;
}

const TABS: TabData[] = [
  {
    label: 'Book & Schedule',
    headline: 'Book a pickup in under a minute — for one device or a hundred.',
    checklist: [
      'Online form or WhatsApp booking',
      'Flexible slots for households and offices',
      'Bulk collection scheduled around your operations',
      'No account or contract required for individuals',
      'Confirmation sent immediately after booking',
    ],
    // TODO: replace with real client quote
    quote:
      'We had forty old laptops sitting in a storeroom for two years. Recycling Hub had them collected within a week of booking.',
    authorInitials: 'OM',
    authorLabel: 'Office Manager',
    authorRole: 'KL trading company',
    mockupLabel: 'Pickup Booking Confirmation',
  },
  {
    label: 'Collect',
    headline: 'Licensed collection, tracked from the moment we arrive.',
    checklist: [
      'DOE-registered, SW110-compliant collection team',
      'Doorstep pickup for individuals, on-site for businesses',
      'Every collected item logged at pickup',
      'Secure transport to our processing facility',
      'No device left unaccounted for',
    ],
    // TODO: replace with real client quote
    quote:
      'The team logged every single unit before it left our building. We had a full manifest the same day.',
    authorInitials: 'FM',
    authorLabel: 'Facilities Manager',
    authorRole: 'Selangor manufacturer',
    mockupLabel: 'Live Collection Log',
  },
  {
    label: 'Sort & Process',
    headline: 'Every device sorted, assessed, and routed correctly.',
    checklist: [
      'Devices assessed for reuse, refurbishment, or recycling',
      'Components separated by material type',
      'Hazardous components handled to DOE standard',
      'Nothing sent to landfill',
      'Processing facility open to compliance audits',
    ],
    // TODO: replace with real client quote
    quote:
      'We asked what actually happens after pickup, and Recycling Hub walked us through the whole process — nothing was vague.',
    authorInitials: 'PL',
    authorLabel: 'Procurement Lead',
    authorRole: 'KL professional services firm',
    mockupLabel: 'Processing Status Board',
  },
  {
    label: 'Data Destruction',
    headline: 'Every data-bearing device destroyed, not just deleted.',
    checklist: [
      'On-site or facility-based certified shredding',
      'Serialized certificate of destruction per asset',
      'PDPA-compliant handling throughout',
      'No resale of data-bearing devices',
      'Certificates available for audit within days',
    ],
    // TODO: replace with real client quote
    quote:
      'We needed proof our old servers were destroyed, not resold. The certificate covered every serial number.',
    authorInitials: 'ITM',
    authorLabel: 'IT Manager',
    authorRole: 'Financial services firm',
    mockupLabel: 'Certificate of Destruction',
  },
  {
    label: 'Get Paid',
    headline: 'Individuals get paid the moment their devices are collected.',
    checklist: [
      'Instant DuitNow payment on collection',
      'No waiting period or manual payout request',
      'Payment confirmed before our team leaves',
      'No hidden deductions',
      'Works for one device or a full clear-out',
    ],
    // TODO: replace with real client quote
    quote:
      'I had a drawer full of old phones. Payment landed in DuitNow before the pickup team even left.',
    authorInitials: 'HS',
    authorLabel: 'Household Seller',
    authorRole: 'Petaling Jaya',
    mockupLabel: 'DuitNow Payment Confirmation',
  },
  {
    label: 'Compliance Docs',
    headline: 'Every collection backed by paperwork your auditor will accept.',
    checklist: [
      'DOE and SW110 documentation per collection',
      'Full chain-of-custody records',
      'Certificates stored and retrievable on request',
      'Ready for internal or third-party audit',
      'No manual record-keeping needed on your end',
    ],
    // TODO: replace with real client quote
    quote:
      'When our auditors asked for e-waste disposal records, we had the full documentation within the hour.',
    authorInitials: 'CO',
    authorLabel: 'Compliance Officer',
    authorRole: 'Klang Valley manufacturer',
    mockupLabel: 'Compliance Documentation Pack',
  },
  {
    label: 'ESG Reporting',
    headline: 'Diversion reports your sustainability team can actually use.',
    checklist: [
      'Tonnage recycled per collection',
      'Landfill diversion summary',
      'Estimated carbon impact',
      'Delivered in a format ready for ESG disclosures',
      'Available on a per-collection or annual basis',
    ],
    // TODO: replace with real client quote
    quote:
      'The diversion report dropped straight into our sustainability disclosure with no extra formatting needed.',
    authorInitials: 'SM',
    authorLabel: 'Sustainability Manager',
    authorRole: 'Malaysian NGO',
    mockupLabel: 'ESG Diversion Report',
  },
];

const CheckBadge = () => (
  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-600">
    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
      <path
        d="M1 4l2.5 2.5L9 1"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

const FeatureTabs = () => {
  const [activeTab, setActiveTab] = useState(0);
  const tab = TABS[activeTab]!;

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div>
          <h2 className="font-montserrat text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">
            What Happens After You Book
          </h2>
          <p className="mt-2 max-w-lg text-base text-slate-500">
            From the moment you book to the certificate in your inbox — every
            step is licensed, tracked, and documented.
          </p>
        </div>

        {/* ── Tab navigation ─────────────────────────────────────────────────── */}
        <div
          className="mb-6 mt-8 flex gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Feature tabs"
        >
          {TABS.map((t, i) => (
            <button
              key={t.label}
              type="button"
              role="tab"
              aria-selected={activeTab === i}
              onClick={() => setActiveTab(i)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${
                activeTab === i
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-500 hover:text-neutral-950'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Content area ───────────────────────────────────────────────────── */}
        <div className="rounded-3xl bg-brand-50 p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              <div className="flex flex-col gap-8 md:flex-row md:items-stretch md:gap-10">
                {/* Left column — text + checklist + quote */}
                <div className="flex shrink-0 flex-col md:w-[42%]">
                  <h3 className="max-w-xs text-lg font-semibold leading-snug text-neutral-950">
                    {tab.headline}
                  </h3>

                  <ul className="mt-5 flex flex-col gap-3">
                    {tab.checklist.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckBadge />
                        <span className="text-sm font-medium text-neutral-950">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Quote card */}
                  <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
                    <p className="text-sm italic leading-relaxed text-slate-500">
                      &ldquo;{tab.quote}&rdquo;
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                        {tab.authorInitials}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-neutral-950">
                          {tab.authorLabel}
                        </p>
                        <p className="text-xs text-slate-400">
                          {tab.authorRole}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right column — mockup placeholder */}
                <div className="flex flex-1 flex-col">
                  <div className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
                    <div className="h-1 w-full bg-brand-600" />
                    <div className="flex min-h-[280px] flex-1 items-center justify-center bg-slate-50 p-8">
                      <p className="text-center text-sm text-slate-400">
                        {tab.mockupLabel}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export { FeatureTabs };
