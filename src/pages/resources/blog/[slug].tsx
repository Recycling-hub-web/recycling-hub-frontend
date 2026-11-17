import type { GetServerSideProps } from 'next';
import type { ReactElement } from 'react';

import { PublicBlogPostView } from '../../../components/features/blogs/components';
import type { BlogPost } from '../../../components/features/blogs/types';
import { Meta } from '../../../components/layout/Meta';
import { PublicLayout } from '../../../layouts/PublicLayout';
import type { NextPageWithLayout } from '../../../types/next';

type BlogPostPageProps = { post: BlogPost };

const BlogPostPage: NextPageWithLayout<BlogPostPageProps> = ({ post }) => (
  <>
    <Meta
      title={post.meta_title || `${post.title} — Recycling Hub`}
      description={
        post.meta_description || post.excerpt || post.content.slice(0, 160)
      }
      canonical={post.canonical_url || undefined}
      noindex={post.no_index}
      openGraph={{
        title: post.og_title || post.meta_title || post.title,
        description:
          post.og_description ||
          post.meta_description ||
          post.excerpt ||
          post.content.slice(0, 160),
        image: post.og_image || post.cover_image?.public_url || undefined,
        type: 'article',
      }}
    />
    <PublicBlogPostView post={post} />
  </>
);

export const getServerSideProps: GetServerSideProps<
  BlogPostPageProps
> = async ({ params }) => {
  const slug = params?.slug;
  if (typeof slug !== 'string') return { notFound: true };
  const target = process.env.API_PROXY_TARGET;
  const apiBase = target
    ? `${target.replace(/\/$/, '')}/api/v1`
    : process.env.NEXT_PUBLIC_API_URL;
  if (!apiBase || !/^https?:\/\//.test(apiBase)) {
    throw new Error(
      'Set API_PROXY_TARGET to render public blog posts on the server.',
    );
  }
  // Fetch anonymously even when the visitor is signed in: staff cookies
  // must never make a draft or private post visible on the public page.
  const response = await fetch(
    `${apiBase.replace(/\/$/, '')}/blogs/${encodeURIComponent(slug)}/`,
    {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(10000),
    },
  );
  if (response.status === 404) return { notFound: true };
  if (!response.ok)
    throw new Error(`Could not load public blog post (${response.status}).`);
  const post = (await response.json()) as BlogPost;
  return { props: { post } };
};

BlogPostPage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default BlogPostPage;
