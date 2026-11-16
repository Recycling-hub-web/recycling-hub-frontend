/** "Beta" — shown beside the Recycling Hub logo in the dashboard
 * (Sidebar on desktop, Topbar on phones) while the system is in beta.
 * Remove the two usages to retire it. */
const BetaBadge = ({ className = '' }: { className?: string }) => (
  <span
    className={`inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-amber-700 ${className}`}
  >
    Beta
  </span>
);

export { BetaBadge };
