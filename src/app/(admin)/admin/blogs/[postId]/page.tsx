import type { Metadata } from 'next';

import { BlogPostDetailsView } from '../../../../../components/features/blogs/components';

export const metadata: Metadata = {
  title: 'Blog Post — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function AdminBlogPostPage({
  params,
}: {
  params: { postId: string };
}) {
  return <BlogPostDetailsView postId={params.postId} basePath="/admin/blogs" />;
}
