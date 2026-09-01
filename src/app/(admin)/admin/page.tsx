import { redirect } from 'next/navigation';

// Landing page for /admin — the only admin section built so far is Users,
// so this just forwards there. As more sections are added (pickups,
// collection points, reports) this becomes a real overview. Server-side
// redirect() (no client round-trip needed, unlike the old
// useRouter().replace() in a useEffect) — Next serves the redirect
// directly, the browser never renders /admin at all.
export default function AdminIndexPage() {
  redirect('/admin/users');
}
