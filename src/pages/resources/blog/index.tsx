import type { ReactElement } from 'react';

import { PublicBlogListView } from '../../../components/features/blogs/components';
import { Meta } from '../../../components/layout/Meta';
import { ReusableHero } from '../../../components/ui/hero';
import { PublicLayout } from '../../../layouts/PublicLayout';
import type { NextPageWithLayout } from '../../../types/next';

const BlogIndexPage: NextPageWithLayout = () => (
  <>
    <Meta
      title="Blog — Recycling Hub E-Waste Guides & Updates"
      description="Recycling tips, e-waste compliance updates, and news from Recycling Hub."
    />
    <ReusableHero
      eyebrow="Resources"
      headline="From the blog"
      description="Recycling tips, compliance updates, and news from the Recycling Hub team."
    />
    <PublicBlogListView />
  </>
);

BlogIndexPage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default BlogIndexPage;
