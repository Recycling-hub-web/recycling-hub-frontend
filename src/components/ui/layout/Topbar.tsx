import { useAuth } from '../../../contexts/AuthContext';

type TopbarProps = {
  /** Shown after the user's name, e.g. their role label. Omit for a plain
   * name-only topbar (Admin has one role, so nothing to disambiguate). */
  subtitle?: string;
};

/** Reusable topbar for every sidebar layout — user identity + sign out.
 * The logo lives in the sidebar next to it, not duplicated here. */
const Topbar = ({ subtitle }: TopbarProps) => {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 shrink-0 items-center justify-end gap-4 border-b border-slate-200 bg-white px-6">
      {user && (
        <span className="text-sm text-slate-600">
          {user.full_name}
          {subtitle ? ` · ${subtitle}` : ''}
        </span>
      )}
      <button
        type="button"
        onClick={logout}
        className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
      >
        Sign out
      </button>
    </header>
  );
};

export { Topbar };
