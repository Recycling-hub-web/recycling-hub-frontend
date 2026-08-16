import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import { useDictionary } from '../../../hooks/useDictionary';

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

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { home } = useDictionary();
  const { faq: content } = home;

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <h2 className="mb-12 text-center font-montserrat text-3xl font-bold leading-tight tracking-[-0.02em] text-neutral-950 md:text-4xl lg:text-5xl">
          {content.headline} <span>{content.headlineAccent}</span>
        </h2>

        <div className="flex flex-col gap-3">
          {content.items.map((item, i) => {
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
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
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
  );
};

export { FaqSection };
