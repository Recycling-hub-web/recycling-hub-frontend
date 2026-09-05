import type { Metadata } from 'next';

import { BlogTagsView } from '../../../../../components/features/blogs/components';

export const metadata: Metadata = {
  title: 'Blog Tags — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function AdminBlogTagsPage() {
  return <BlogTagsView basePath="/admin/blogs" />;
}
