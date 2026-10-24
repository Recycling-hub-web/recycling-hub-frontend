import type { Metadata } from 'next';

import { CreateBlogPostView } from '../../../../../components/features/blogs/components';

export const metadata: Metadata = {
  title: 'New Post — Recycling Hub Super Admin',
  robots: { index: false, follow: false },
};

export default function SuperAdminCreateBlogPostPage() {
  return <CreateBlogPostView basePath="/super-admin/blogs" />;
}
