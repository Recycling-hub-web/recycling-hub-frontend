import { motion } from 'framer-motion';

import { BRAND } from '../../../constants/content';
import { useDictionary } from '../../../hooks/useDictionary';
import { Button } from '../../ui/buttons/Button';
import { FadeIn } from '../../ui/FadeIn';
import { SectionHeading } from '../../ui/SectionHeading';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const BookDemo = () => {
  const { bookDemo: content } = useDictionary();

  return (
    <section id="book-demo" className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <FadeIn>
            <SectionHeading
              eyebrow={content.eyebrow}
              headline={content.headline}
            />
          </FadeIn>

          <ul className="mt-8 flex flex-col gap-3 text-left">
            {content.bullets.map((bullet, i) => (
              <motion.li
                key={bullet}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.08, ease: EASE }}
                className="flex items-start gap-3"
              >
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-neutral-100">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M1.5 5l2.5 2.5 4.5-4.5"
                      stroke="#0f0f0f"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="text-sm leading-relaxed text-slate-700">
                  {bullet}
                </span>
              </motion.li>
            ))}
          </ul>

          <FadeIn delay={0.15}>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href={BRAND.calendly}>{content.ctaPrimary}</Button>
              <Button href={BRAND.whatsapp} variant="secondary">
                {content.ctaSecondary}
              </Button>
            </div>
          </FadeIn>

          <FadeIn delay={0.25}>
            <p className="mt-6 text-xs text-slate-500">{content.trustNote}</p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export { BookDemo };
