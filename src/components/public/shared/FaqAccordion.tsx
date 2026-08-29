import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useState } from 'react';

type FaqItem = { question: string; answer: string };

type FaqAccordionProps = {
  items: readonly FaqItem[];
  heading: ReactNode;
  sectionClassName?: string;
  answerClassName?: string;
};

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

/** Shared accordion-style FAQ list. Each page supplies its own heading markup
 * and data source (home/pricing/contact), plus any section-level style overrides,
 * so the open/close behaviour and card markup aren't copy-pasted per page. */
const FaqAccordion = ({
  items,
  heading,
  sectionClassName = 'bg-white py-20 md:py-28',
  answerClassName = 'text-slate-600',
}: FaqAccordionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className={sectionClassName}>
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        {heading}

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
                  onClick={() => setOpenIndex(isOpen ? null : i)}
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
                        <p
                          className={`text-sm leading-relaxed ${answerClassName}`}
                        >
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

export { FaqAccordion };
export type { FaqItem };
