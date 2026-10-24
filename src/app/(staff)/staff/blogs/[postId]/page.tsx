import type { Metadata } from 'next';

import { BlogPostDetailsView } from '../../../../../components/features/blogs/components';

export const metadata: Metadata = {
  title: 'Blog Post — Recycling Hub Staff',
  robots: { index: false, follow: false },
};

export default function StaffBlogPostPage({
  params,
}: {
  params: { postId: string };
}) {
  return <BlogPostDetailsView postId={params.postId} basePath="/staff/blogs" />;
}
