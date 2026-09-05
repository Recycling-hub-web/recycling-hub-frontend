import type { Metadata } from 'next';

import { EditBlogPostView } from '../../../../../../components/features/blogs/components';

export const metadata: Metadata = {
  title: 'Edit Post — Recycling Hub Staff',
  robots: { index: false, follow: false },
};

export default function StaffEditBlogPostPage({
  params,
}: {
  params: { postId: string };
}) {
  return <EditBlogPostView postId={params.postId} basePath="/staff/blogs" />;
}
