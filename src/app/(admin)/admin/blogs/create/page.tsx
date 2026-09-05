import type { Metadata } from 'next';

import { CreateBlogPostView } from '../../../../../components/features/blogs/components';

export const metadata: Metadata = {
  title: 'New Post — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function AdminCreateBlogPostPage() {
  return <CreateBlogPostView basePath="/admin/blogs" />;
}
