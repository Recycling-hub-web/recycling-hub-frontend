import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import { useEffect } from 'react';

import { AdminLayout } from '../../layouts/AdminLayout';
import type { NextPageWithLayout } from '../../types/next';

// Landing page for /admin — the only admin section built so far is Users,
// so this just forwards there. As more sections are added (pickups,
// collection points, reports) this becomes a real overview.
const AdminIndexPage: NextPageWithLayout = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/users');
  }, [router]);

  return null;
};

AdminIndexPage.getLayout = (page: ReactElement) => (
  <AdminLayout>{page}</AdminLayout>
);

export default AdminIndexPage;
