import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { ABOUT_VALUES, ASSETS } from '../../../constants/content';

const ease = [0.22, 1, 0.36, 1] as const;

const LABELS = ['Vision', 'Mission', 'Core Values'];

const FoundationSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sectionRefs.current.forEach((ref, index) => {
      if (!ref) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveIndex(index);
          });
        },
        { threshold: 0.4, rootMargin: '-15% 0px -15% 0px' },
      );

      observer.observe(ref);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  const scrollTo = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  return (
    <section className="bg-neutral-50 py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease }}
          className="mb-20 text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Who We Are
          </p>
          <h2 className="mt-3 font-montserrat text-4xl font-bold tracking-tight text-neutral-950 md:text-5xl">
            Vision, Mission &amp; Values
          </h2>
        </motion.div>

        {/* Sticky scroll layout */}
        <div className="flex gap-16 lg:gap-24">
          {/* Left: sticky labels — desktop only */}
          <div className="hidden shrink-0 lg:block lg:w-72">
            <div className="sticky top-1/3">
              <ul className="space-y-6">
                {LABELS.map((label, i) => (
                  <li key={label}>
                    <button
                      type="button"
                      onClick={() => scrollTo(i)}
                      className="text-left"
                    >
                      <span
                        className={`block font-montserrat font-bold transition-all duration-500 ${
                          activeIndex === i
                            ? 'text-4xl text-neutral-950'
                            : 'text-2xl text-slate-300 hover:text-slate-400'
                        }`}
                      >
                        {label}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: scrolling content blocks */}
          <div className="flex-1">
            {/* Vision */}
            <div
              ref={(el) => {
                sectionRefs.current[0] = el;
              }}
              className="flex min-h-[55vh] items-center py-10 lg:py-0"
            >
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease }}
                className="w-full rounded-2xl border border-slate-200 bg-white p-8 md:p-10"
              >
                <div className="mb-6 flex size-12 items-center justify-center rounded-xl bg-neutral-100">
                  <Image
                    src={ASSETS.logo.symbolColor}
                    alt=""
                    width={560}
                    height={565}
                    className="size-7 object-contain"
                  />
                </div>
                <h3 className="font-montserrat text-2xl font-bold text-neutral-950">
                  Our Vision
                </h3>
                <p className="mt-4 text-base leading-relaxed text-slate-500">
                  A Malaysia where no old device ends up with an informal scrap
                  dealer — every collection registered, every device accounted
                  for, and every byte of data properly destroyed.
                </p>
              </motion.div>
            </div>

            {/* Mission */}
            <div
              ref={(el) => {
                sectionRefs.current[1] = el;
              }}
              className="flex min-h-[55vh] items-center py-10 lg:py-0"
            >
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease }}
                className="w-full rounded-2xl bg-gradient-to-br from-brand-800 to-brand-600 p-8 md:p-10"
              >
                <div className="mb-6 flex size-12 items-center justify-center rounded-xl bg-white/15">
                  <Image
                    src={ASSETS.logo.symbolWhite}
                    alt=""
                    width={560}
                    height={565}
                    className="size-7 object-contain"
                  />
                </div>
                <h3 className="font-montserrat text-2xl font-bold text-white">
                  Our Mission
                </h3>
                <p className="mt-4 text-base leading-relaxed text-white/75">
                  To make DOE-registered, fully documented e-waste collection
                  the easy default — free for individuals, compliant and
                  reported for businesses, and safe for your data either way.
                </p>
              </motion.div>
            </div>

            {/* Core Values */}
            <div
              ref={(el) => {
                sectionRefs.current[2] = el;
              }}
              className="flex min-h-[55vh] items-center py-10 lg:py-0"
            >
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease }}
                className="w-full rounded-2xl border border-slate-200 bg-white p-8 md:p-10"
              >
                <div className="mb-6 flex size-12 items-center justify-center rounded-xl bg-neutral-100">
                  <Image
                    src={ASSETS.logo.symbolColor}
                    alt=""
                    width={560}
                    height={565}
                    className="size-7 object-contain"
                  />
                </div>
                <h3 className="font-montserrat text-2xl font-bold text-neutral-950">
                  Core Values
                </h3>
                <ul className="mt-6 space-y-4">
                  {ABOUT_VALUES.map((v) => (
                    <li key={v.title} className="flex items-start gap-3">
                      <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-brand-500" />
                      <p className="text-sm leading-relaxed text-slate-500">
                        <span className="font-semibold text-neutral-950">
                          {v.title}
                        </span>{' '}
                        — {v.description}
                      </p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { FoundationSection };
