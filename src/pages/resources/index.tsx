import Link from 'next/link';
import type { ReactElement } from 'react';
import { LuArrowRight } from 'react-icons/lu';

import { Meta } from '../../components/layout/Meta';
import { ResourcesGrid } from '../../components/public/resources/ResourcesGrid';
import { FadeIn } from '../../components/ui/FadeIn';
import { ReusableHero } from '../../components/ui/hero';
import { useDictionary } from '../../hooks/useDictionary';
import { PublicLayout } from '../../layouts/PublicLayout';
import type { NextPageWithLayout } from '../../types/next';

const ResourcesPage: NextPageWithLayout = () => {
  const {
    resources: { hero },
  } = useDictionary();

  return (
    <>
      <Meta
        title="Resources — Recycling Hub E-Waste Guides & Compliance"
        description="Guides on DOE registration, SW110 compliance, certified data destruction, ESG reporting, and how to prepare for your e-waste pickup."
      />
      <ReusableHero
        eyebrow={hero.eyebrow}
        headline={hero.headline}
        description={hero.description}
      />
      <ResourcesGrid />

      {/* Blog — the dynamic, database-backed counterpart to the static
       * guides above (features/blogs/, managed from the admin panel),
       * so it's a link out to its own section rather than mixed into
       * ResourcesGrid's dictionary-driven card data. */}
      <section className="bg-neutral-50 py-16 text-center md:py-20">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
            More from Recycling Hub
          </p>
          <h2 className="mt-3 font-montserrat text-2xl font-bold text-neutral-950 md:text-3xl">
            Read our blog
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500 md:text-base">
            Recycling tips, compliance updates, and news from the team.
          </p>
          <Link
            href="/resources/blog"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600"
          >
            Visit the blog <LuArrowRight className="size-4" />
          </Link>
        </FadeIn>
      </section>
    </>
  );
};

ResourcesPage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default ResourcesPage;
