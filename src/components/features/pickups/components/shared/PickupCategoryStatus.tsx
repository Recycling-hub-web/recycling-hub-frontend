type Props = {
  loading: boolean;
  error: string;
  count: number;
  onRetry: () => void;
};
/** Keep lookup outages distinct from an empty material catalogue. */
export const PickupCategoryStatus = ({
  loading,
  error,
  count,
  onRetry,
}: Props) => {
  if (loading)
    return (
      <p role="status" className="mb-3 text-sm text-slate-600 sm:col-span-2">
        Loading materials…
      </p>
    );
  if (error)
    return (
      <div
        role="alert"
        className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 sm:col-span-2"
      >
        <p>{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="min-h-11 rounded px-2 font-semibold underline focus-visible:outline focus-visible:outline-2"
        >
          Retry materials
        </button>
      </div>
    );
  if (!count)
    return (
      <p className="mb-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-600 sm:col-span-2">
        No active materials are available. Ask an administrator to add or
        activate a material category.
      </p>
    );
  return null;
};
