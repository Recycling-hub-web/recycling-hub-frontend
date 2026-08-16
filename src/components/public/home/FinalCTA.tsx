import { BRAND } from '../../../constants/content';
import { useDictionary } from '../../../hooks/useDictionary';
import { Button } from '../../ui/buttons/Button';
import { FadeIn } from '../../ui/FadeIn';
import { SectionHeading } from '../../ui/SectionHeading';

const FinalCTA = () => {
  const { home } = useDictionary();
  const { finalCta: content } = home;

  return (
    <section className="bg-hero-gradient py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 text-center md:px-8">
        <SectionHeading
          eyebrow={content.eyebrow}
          headline={content.headline}
          subtext={content.subtext}
          light
        />

        <FadeIn delay={0.5}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href={content.ctaHref} variant="white">
              {content.cta}
            </Button>
            <Button href={BRAND.whatsapp} variant="outline-white">
              {content.whatsapp}
            </Button>
          </div>
        </FadeIn>

        <FadeIn delay={0.65}>
          <p className="mt-6 text-xs text-white/45">{content.note}</p>
        </FadeIn>
      </div>
    </section>
  );
};

export { FinalCTA };
