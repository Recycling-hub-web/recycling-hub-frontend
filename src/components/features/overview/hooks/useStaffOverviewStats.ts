import { useEffect, useState } from 'react';

import { listBlogPosts } from '../../blogs/services/blogService';
import { listContactMessages } from '../../contact/services/contactService';
import { listPickupRequests } from '../../pickups/services/pickupService';

type StaffOverviewStats = {
  pendingPickups: number | null;
  pendingMessages: number | null;
  publishedPosts: number | null;
};

const INITIAL: StaffOverviewStats = {
  pendingPickups: null,
  pendingMessages: null,
  publishedPosts: null,
};

/** Same shape as useAdminOverviewStats, minus totalUsers — Staff has no
 * Users module/access (IsAdminOrStaffUser vs. admin-only endpoints). */
const useStaffOverviewStats = () => {
  const [stats, setStats] = useState<StaffOverviewStats>(INITIAL);

  useEffect(() => {
    let cancelled = false;

    listPickupRequests({ status: 'pending' })
      .then((data) => {
        if (!cancelled)
          setStats((prev) => ({ ...prev, pendingPickups: data.count }));
      })
      .catch(() => {});
    listContactMessages({ status: 'pending' })
      .then((data) => {
        if (!cancelled)
          setStats((prev) => ({ ...prev, pendingMessages: data.count }));
      })
      .catch(() => {});
    listBlogPosts({ status: 'published', page_size: 1 })
      .then((data) => {
        if (!cancelled)
          setStats((prev) => ({ ...prev, publishedPosts: data.count }));
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return stats;
};

export { useStaffOverviewStats };
