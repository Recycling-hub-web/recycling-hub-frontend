import { useRouter } from 'next/router';
import type { ReactElement } from 'react';

import { PublicBlogPostView } from '../../../components/features/blogs/components';
import { Meta } from '../../../components/layout/Meta';
import { Loading } from '../../../components/ui/loading/Loading';
import { PublicLayout } from '../../../layouts/PublicLayout';
import type { NextPageWithLayout } from '../../../types/next';

const BlogPostPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { slug } = router.query;

  // Dynamic-route query params aren't populated until the router has
  // hydrated — fetching with `slug` still undefined would 404 against
  // GET /blogs/undefined/ for a moment on first paint.
  if (!router.isReady || typeof slug !== 'string') {
    return <Loading text="Loading post…" />;
  }

  return (
    <>
      <Meta
        title="Blog — Recycling Hub"
        description="Recycling tips, e-waste compliance updates, and news from Recycling Hub."
      />
      <PublicBlogPostView slug={slug} />
    </>
  );
};

BlogPostPage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default BlogPostPage;
