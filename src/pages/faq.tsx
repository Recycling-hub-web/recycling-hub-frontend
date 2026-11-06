import Link from 'next/link';
import type { ReactElement } from 'react';

import { Meta } from '../components/layout/Meta';
import { PublicSeoSchema } from '../components/layout/PublicSeoSchema';
import { ReusableHero } from '../components/ui/hero';
import { useDictionary } from '../hooks/useDictionary';
import { PublicLayout } from '../layouts/PublicLayout';
import type { NextPageWithLayout } from '../types/next';

const FaqPage: NextPageWithLayout = () => {
  const { faqPage, seo, nav } = useDictionary();
  return (
    <>
      <Meta {...seo.faq} />
      <PublicSeoSchema page="faq" />
      <ReusableHero
        eyebrow={faqPage.eyebrow}
        headline={faqPage.headline}
        headlineAccent={faqPage.headlineAccent}
        description={faqPage.subtext}
      />
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <div className="flex flex-col gap-14">
            {faqPage.categories.map((category) => (
              <div key={category.name}>
                <h2 className="mb-5 text-xl font-bold text-neutral-950">
                  {category.name}
                </h2>
                <div className="flex flex-col gap-3">
                  {category.items.map((item, index) => (
                    <details
                      key={item.question}
                      open={index === 0}
                      className="rounded-xl border border-slate-200 bg-white"
                    >
                      <summary className="cursor-pointer px-6 py-5 font-medium text-slate-800 focus-visible:outline-brand-600">
                        {item.question}
                      </summary>
                      <p className="border-t border-slate-100 px-6 py-5 text-sm leading-relaxed text-slate-600">
                        {item.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-6 text-brand-700 underline underline-offset-4">
            <Link href="/request-pickup">{nav.requestPickup}</Link>
            <Link href="/request-quote">{nav.requestQuote}</Link>
            <Link href="/track-trace">
              {faqPage.categories[3]!.items[0]!.question}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

FaqPage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);
export default FaqPage;
