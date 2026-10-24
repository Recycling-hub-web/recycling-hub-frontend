import type { Metadata } from 'next';

import { BlogPostsView } from '../../../../components/features/blogs/components';

export const metadata: Metadata = {
  title: 'Blog Posts — Recycling Hub Super Admin',
  robots: { index: false, follow: false },
};

export default function SuperAdminBlogsPage() {
  return <BlogPostsView basePath="/super-admin/blogs" />;
}
