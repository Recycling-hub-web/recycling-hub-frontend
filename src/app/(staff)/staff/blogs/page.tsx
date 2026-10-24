import type { Metadata } from 'next';

import { BlogPostsView } from '../../../../components/features/blogs/components';

export const metadata: Metadata = {
  title: 'Blog Posts — Recycling Hub Staff',
  robots: { index: false, follow: false },
};

export default function StaffBlogsPage() {
  return <BlogPostsView basePath="/staff/blogs" />;
}
