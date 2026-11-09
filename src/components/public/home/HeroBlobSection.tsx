import Image from 'next/image';
import { LuArrowUpRight } from 'react-icons/lu';

import { useDictionary } from '../../../hooks/useDictionary';
import { PublicButton } from '../../ui/buttons/PublicButton';

const HeroBlobSection = () => {
  const {
    home: { hero: content, splitHero },
    nav,
  } = useDictionary();

  return (
    <section className="overflow-hidden bg-brand-50/50 pb-12 pt-28 md:pb-16 md:pt-36">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 md:grid-cols-[1.2fr_1fr] md:gap-12 md:px-8">
        <div>
          <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-brand-700">
            {splitHero.individual.badge} · {splitHero.business.badge}
          </p>
          <h1 className="font-montserrat text-4xl font-extrabold leading-[1.15] tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
            {content.headlinePrefix}{' '}
            <span className="text-brand-700">{content.headlinePill}</span>{' '}
            {content.headlineSuffix}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
            {content.subheadline}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <PublicButton href="/request-pickup">
              {nav.requestPickup}
              <LuArrowUpRight className="ml-2" size={18} />
            </PublicButton>
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-brand-100">
          <Image
            src="/assets/img/E-Wast-Recycler/E-Wast-Recycler-7.png"
            alt={content.imageAlt}
            fill
            priority
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export { HeroBlobSection };
