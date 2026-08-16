import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import { useDictionary } from '../../../hooks/useDictionary';

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
  const {
    home: { featureTabs: content },
  } = useDictionary();
  const { tabs } = content;
  const tab = tabs[activeTab]!;

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div>
          <h2 className="font-montserrat text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">
            {content.headline}
          </h2>
          <p className="mt-2 max-w-lg text-base text-slate-500">
            {content.subtext}
          </p>
        </div>

        {/* ── Tab navigation ─────────────────────────────────────────────────── */}
        <div
          className="mb-6 mt-8 flex gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Feature tabs"
        >
          {tabs.map((t, i) => (
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
