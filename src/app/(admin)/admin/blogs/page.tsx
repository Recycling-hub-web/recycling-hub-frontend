import type { Metadata } from 'next';

import { BlogPostsView } from '../../../../components/features/blogs/components';

export const metadata: Metadata = {
  title: 'Blog Posts — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function AdminBlogsPage() {
  return <BlogPostsView basePath="/admin/blogs" />;
}
