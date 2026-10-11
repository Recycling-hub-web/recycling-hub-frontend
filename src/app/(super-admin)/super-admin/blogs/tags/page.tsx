import type { Metadata } from 'next';

import { BlogTagsView } from '../../../../../components/features/blogs/components';

export const metadata: Metadata = {
  title: 'Blog Tags — Recycling Hub Super Admin',
  robots: { index: false, follow: false },
};

export default function SuperAdminBlogTagsPage() {
  return <BlogTagsView basePath="/super-admin/blogs" />;
}
