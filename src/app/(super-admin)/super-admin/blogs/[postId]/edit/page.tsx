import type { Metadata } from 'next';

import { EditBlogPostView } from '../../../../../../components/features/blogs/components';

export const metadata: Metadata = {
  title: 'Edit Post — Recycling Hub Super Admin',
  robots: { index: false, follow: false },
};

export default function SuperAdminEditBlogPostPage({
  params,
}: {
  params: { postId: string };
}) {
  return (
    <EditBlogPostView postId={params.postId} basePath="/super-admin/blogs" />
  );
}
