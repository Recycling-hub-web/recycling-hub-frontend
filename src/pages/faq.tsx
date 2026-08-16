import { AnimatePresence, motion } from 'framer-motion';
import type { ReactElement } from 'react';
import { useState } from 'react';

import { Meta } from '../components/layout/Meta';
import { BookDemo } from '../components/public/shared/BookDemo';
import { ReusableHero } from '../components/ui/hero';
import { useDictionary } from '../hooks/useDictionary';
import { PublicLayout } from '../layouts/PublicLayout';
import type { NextPageWithLayout } from '../types/next';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

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

const CategoryFaq = ({
  name,
  items,
}: {
  name: string;
  items: { question: string; answer: string }[];
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div>
      <h2 className="mb-5 font-montserrat text-lg font-extrabold text-neutral-950 md:text-xl">
        {name}
      </h2>
      <div className="flex flex-col gap-3">
        {items.map((item, i) => {
          const isOpen = openIndex === i;
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
                onClick={() => toggle(i)}
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
                    transition={{ duration: 0.28, ease: EASE }}
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
  );
};

const FaqPage: NextPageWithLayout = () => {
  const { faqPage } = useDictionary();

  return (
    <>
      <Meta
        title="FAQ — Recycling Hub"
        description="Answers to common questions about individual pickup, bulk and enterprise collection, certified data destruction, and certificate requests."
      />

      <ReusableHero
        eyebrow={faqPage.eyebrow}
        headline={faqPage.headline}
        headlineAccent={faqPage.headlineAccent}
        description={faqPage.subtext}
      />

      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <div className="flex flex-col gap-14">
            {faqPage.categories.map((category) => (
              <CategoryFaq
                key={category.name}
                name={category.name}
                items={category.items}
              />
            ))}
          </div>
        </div>
      </section>

      <BookDemo />
    </>
  );
};

FaqPage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default FaqPage;
