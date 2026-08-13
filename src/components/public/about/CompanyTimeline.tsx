import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

import { ABOUT_TIMELINE } from '../../../constants/content';
import { SectionHeading } from '../../ui/SectionHeading';

const ease = [0.22, 1, 0.36, 1] as const;

const CompanyTimeline = () => {
  const timelineRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 70%', 'end 30%'],
  });

  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-16 text-center">
          <SectionHeading
            eyebrow="Our Story"
            headline="How Recycling Hub Came to Be"
          />
        </div>

        <div ref={timelineRef} className="relative mx-auto max-w-2xl">
          {/* Growing line */}
          <div className="absolute left-[19px] top-2 hidden h-[calc(100%-1rem)] w-px bg-slate-200 md:block">
            <motion.div
              style={{ scaleY: lineScaleY, originY: 0 }}
              className="size-full bg-brand-400"
            />
          </div>

          <div className="flex flex-col gap-10 md:gap-12">
            {ABOUT_TIMELINE.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: i * 0.1, ease }}
                className="flex gap-5 md:gap-8"
              >
                {/* Dot */}
                <div className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-brand-300 bg-white">
                  <div className="size-2.5 rounded-full bg-brand-600" />
                </div>

                {/* Content */}
                <div className="pb-2 pt-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-500">
                    {item.year}
                  </span>
                  <h3 className="mt-1 font-montserrat text-lg font-extrabold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { CompanyTimeline };
