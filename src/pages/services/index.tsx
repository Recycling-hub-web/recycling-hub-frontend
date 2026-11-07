import Link from 'next/link';
import type { ReactElement } from 'react';
import { LuArrowRight } from 'react-icons/lu';

import { Meta } from '../../components/layout/Meta';
import { PublicSeoSchema } from '../../components/layout/PublicSeoSchema';
import { ServicesGrid } from '../../components/public/services/ServicesGrid';
import { ServicesTrustBar } from '../../components/public/services/ServicesTrustBar';
import { ReusableHero } from '../../components/ui/hero';
import { useDictionary } from '../../hooks/useDictionary';
import { PublicLayout } from '../../layouts/PublicLayout';
import type { NextPageWithLayout } from '../../types/next';

const ServicesPage: NextPageWithLayout = () => {
  const {
    services: { hero, crossLink, intent },
    seo,
  } = useDictionary();

  return (
    <>
      <Meta {...seo.services} />
      <PublicSeoSchema page="services" />
      <ReusableHero
        eyebrow={hero.eyebrow}
        headline={hero.headline}
        headlineAccent={hero.headlineAccent}
        description={hero.description}
      />
      <ServicesTrustBar />
      <ServicesGrid />
      <section className="bg-white px-5 pb-16 md:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-neutral-950">
            {intent.heading}
          </h2>
          <p className="mt-4 leading-relaxed text-slate-600">
            {intent.description}
          </p>
          <div className="mt-6 flex flex-col gap-4 text-brand-700 underline underline-offset-4">
            <Link href="/services/certified-data-destruction">
              {intent.dataLink}
            </Link>
            <Link href="/services/bulk-industrial-collection">
              {intent.bulkLink}
            </Link>
            <Link href="/request-quote">{intent.quoteLink}</Link>
          </div>
        </div>
      </section>
      <div className="bg-white pb-16 text-center md:pb-20">
        <Link
          href={crossLink.href}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          {crossLink.text} {crossLink.cta}
          <LuArrowRight size={15} />
        </Link>
      </div>
    </>
  );
};

ServicesPage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default ServicesPage;
