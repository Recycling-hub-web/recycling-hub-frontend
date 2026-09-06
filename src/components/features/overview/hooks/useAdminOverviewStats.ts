import { useEffect, useState } from 'react';

import { listBlogPosts } from '../../blogs/services/blogService';
import { listContactMessages } from '../../contact/services/contactService';
import { listPickupRequests } from '../../pickups/services/pickupService';
import { listUsers } from '../../users/services/userService';

type AdminOverviewStats = {
  totalUsers: number | null;
  pendingPickups: number | null;
  pendingMessages: number | null;
  publishedPosts: number | null;
};

const INITIAL: AdminOverviewStats = {
  totalUsers: null,
  pendingPickups: null,
  pendingMessages: null,
  publishedPosts: null,
};

/** Four counts for the Admin dashboard — each read off an existing
 * paginated list endpoint's `count` field (the total across every page
 * of that filter, not just the page fetched), so this needs no new
 * backend endpoint. Fetched in parallel; each stays `null` (renders as
 * a loading skeleton in OverviewStatCard) until its own request
 * resolves, rather than blocking all four on the slowest one. */
const useAdminOverviewStats = () => {
  const [stats, setStats] = useState<AdminOverviewStats>(INITIAL);

  useEffect(() => {
    let cancelled = false;

    listUsers({ page: 1 })
      .then((data) => {
        if (!cancelled)
          setStats((prev) => ({ ...prev, totalUsers: data.count }));
      })
      .catch(() => {});
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

export { useAdminOverviewStats };
