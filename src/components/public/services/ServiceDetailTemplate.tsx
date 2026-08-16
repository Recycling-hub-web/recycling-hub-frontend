import { motion } from 'framer-motion';
import { LuCamera, LuCheck, LuFileText } from 'react-icons/lu';

import {
  BRAND,
  SERVICE_DETAILS,
  SERVICES,
  type ServiceSlug,
} from '../../../constants/content';
import { useDictionary } from '../../../hooks/useDictionary';
import { Button } from '../../ui/buttons/Button';
import { FadeIn } from '../../ui/FadeIn';
import { ReusableHero } from '../../ui/hero';
import { SERVICE_ICONS, ServicesGrid } from './ServicesGrid';

const ease = [0.22, 1, 0.36, 1] as const;

type ServiceDetailTemplateProps = {
  slug: ServiceSlug;
};

const VISUAL_ICONS = {
  photos: LuCamera,
  certificate: LuFileText,
};

const ServiceDetailTemplate = ({ slug }: ServiceDetailTemplateProps) => {
  const { nav, services: dictServices } = useDictionary();
  const service = SERVICES.find((s) => s.slug === slug)!;
  const structural = SERVICE_DETAILS[slug];
  const { title } = dictServices.cards[slug];
  const details = dictServices.detail[slug];
  const Icon = SERVICE_ICONS[service.icon];
  const visual = structural.visual
    ? {
        Icon: VISUAL_ICONS[structural.visual],
        label: dictServices.visualPlaceholders[structural.visual],
      }
    : null;

  return (
    <>
      <ReusableHero
        eyebrow={nav.services}
        headline={title}
        description={details.description}
      />

      {/* What's included */}
      <section className="bg-white pb-16 md:pb-20">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <FadeIn>
            <h2 className="mb-6 font-montserrat text-xl font-extrabold text-neutral-950">
              {dictServices.whatsIncludedHeading}
            </h2>
          </FadeIn>

          <ul className="flex flex-col gap-3">
            {details.included.map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.06, ease }}
                className="flex items-start gap-3 rounded-xl border border-slate-100 bg-neutral-50 px-5 py-4"
              >
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  <LuCheck size={12} strokeWidth={3} />
                </span>
                <span className="text-sm leading-relaxed text-slate-700">
                  {item}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* Trust / compliance element */}
      <section className="bg-neutral-50 py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <FadeIn>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
              <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Icon size={22} />
              </div>
              <h3 className="font-montserrat text-base font-extrabold text-neutral-950">
                {details.trust.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                {details.trust.description}
              </p>

              {visual && (
                <div className="mt-6 flex items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-neutral-50 px-5 py-4 text-slate-400">
                  <visual.Icon size={18} className="shrink-0" />
                  <span className="text-xs leading-relaxed">
                    {visual.label}
                  </span>
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-5 text-center md:px-8">
          <FadeIn>
            <Button href={`/request-quote?service=${slug}`}>
              {nav.requestQuote}
            </Button>
          </FadeIn>

          {slug === 'collection-pickup' && (
            <FadeIn delay={0.1}>
              <p className="mt-4 text-sm text-slate-500">
                {dictServices.freeIndividualNote.prefix}
                <a
                  href={BRAND.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-brand-600 underline underline-offset-2"
                >
                  {dictServices.freeIndividualNote.linkText}
                </a>
                {dictServices.freeIndividualNote.suffix}
              </p>
            </FadeIn>
          )}
        </div>
      </section>

      <ServicesGrid excludeSlug={slug} variant="compact" />
    </>
  );
};

export { ServiceDetailTemplate };
