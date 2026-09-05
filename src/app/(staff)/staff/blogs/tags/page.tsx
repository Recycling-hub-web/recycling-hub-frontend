import type { Metadata } from 'next';

import { BlogTagsView } from '../../../../../components/features/blogs/components';

export const metadata: Metadata = {
  title: 'Blog Tags — Recycling Hub Staff',
  robots: { index: false, follow: false },
};

export default function StaffBlogTagsPage() {
  return <BlogTagsView basePath="/staff/blogs" />;
}
