import { B2B_SECTION } from '../../../constants/content';
import { ArrowButton } from '../../ui/buttons/ArrowButton';
import { FadeIn } from '../../ui/FadeIn';
import { SectionHeading } from '../../ui/SectionHeading';

type PillarIcon = 'truck' | 'shield' | 'chart';

const ICONS: Record<PillarIcon, JSX.Element> = {
  truck: (
    <svg viewBox="0 0 24 24" fill="none" className="size-6">
      <path
        d="M3 16V6a1 1 0 011-1h9v11M3 16h1m0 0a2 2 0 104 0m-4 0a2 2 0 004 0m6 0a2 2 0 104 0m-4 0a2 2 0 004 0m0 0h2v-4l-3-4h-4v8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" className="size-6">
      <path
        d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24" fill="none" className="size-6">
      <path
        d="M4 20V10m6 10V4m6 16v-7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
};

const B2BSection = () => (
  <section className="relative overflow-hidden bg-hero-gradient py-20 md:py-28">
    <div className="mx-auto max-w-6xl px-5 md:px-8">
      <SectionHeading
        light
        eyebrow={B2B_SECTION.eyebrow}
        headline={B2B_SECTION.headline}
        subtext={B2B_SECTION.subheadline}
      />

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {B2B_SECTION.pillars.map((pillar, i) => (
          <FadeIn key={pillar.title} delay={i * 0.1}>
            <div className="flex h-full flex-col rounded-2xl bg-white/10 p-6 ring-1 ring-white/15 backdrop-blur-sm">
              <span className="flex size-11 items-center justify-center rounded-xl bg-white/15 text-white">
                {ICONS[pillar.icon as PillarIcon]}
              </span>
              <h3 className="mt-5 font-montserrat text-lg font-bold text-white">
                {pillar.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                {pillar.description}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.3} className="mt-12 flex flex-col items-center gap-4">
        <ArrowButton href={B2B_SECTION.ctaHref}>{B2B_SECTION.cta}</ArrowButton>
        <p className="max-w-md text-center text-sm text-white/50">
          {B2B_SECTION.note}
        </p>
      </FadeIn>
    </div>
  </section>
);

export { B2BSection };
