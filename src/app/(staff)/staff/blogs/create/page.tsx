import type { Metadata } from 'next';

import { CreateBlogPostView } from '../../../../../components/features/blogs/components';

export const metadata: Metadata = {
  title: 'New Post — Recycling Hub Staff',
  robots: { index: false, follow: false },
};

export default function StaffCreateBlogPostPage() {
  return <CreateBlogPostView basePath="/staff/blogs" />;
}
