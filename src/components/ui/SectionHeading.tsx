import { FadeIn } from './FadeIn';
import { SplitText } from './SplitText';

type SectionHeadingProps = {
  eyebrow: string;
  headline: string;
  subtext?: string;
  centered?: boolean;
  light?: boolean;
};

const SectionHeading = ({
  eyebrow,
  headline,
  subtext,
  centered = true,
  light = false,
}: SectionHeadingProps) => (
  <div className={centered ? 'text-center' : ''}>
    <FadeIn>
      <span
        className={`mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest ${
          light ? 'bg-white/15 text-white/80' : 'bg-brand-50 text-brand-700'
        }`}
      >
        {eyebrow}
      </span>
    </FadeIn>

    <SplitText
      text={headline}
      as="h2"
      delay={0.08}
      stagger={0.055}
      justify={centered ? 'center' : 'flex-start'}
      className={`mt-2 font-montserrat text-2xl font-bold tracking-[-0.02em] md:text-3xl lg:text-4xl ${
        light ? 'text-white' : 'text-neutral-950'
      }`}
    />

    {subtext && (
      <FadeIn delay={0.35}>
        <p
          className={`mx-auto mt-4 max-w-2xl text-base leading-relaxed md:text-lg ${
            light ? 'text-white/65' : 'text-slate-500'
          }`}
        >
          {subtext}
        </p>
      </FadeIn>
    )}
  </div>
);

export { SectionHeading };
