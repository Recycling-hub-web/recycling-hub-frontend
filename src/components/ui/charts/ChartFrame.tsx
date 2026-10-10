import type { ReactNode } from 'react';
import { LuRefreshCw, LuTriangleAlert } from 'react-icons/lu';

type ChartFrameProps = {
  height: number;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  isEmpty?: boolean;
  emptyMessage?: string;
  children: ReactNode;
};

/** Shared loading/error/empty shell for LineChart/BarChart/DonutChart —
 * same three states TableErrorRow/TableEmptyRow/TableLoadingRow already
 * standardize for tables, just sized for a chart's fixed height instead
 * of a table row. Not exported outside ui/charts — an internal building
 * block, not part of the three components' own public API. */
const ChartFrame = ({
  height,
  loading,
  error,
  onRetry,
  isEmpty,
  emptyMessage = 'No data yet.',
  children,
}: ChartFrameProps) => {
  if (loading) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center"
        role="status"
        aria-label="Loading chart"
      >
        <div className="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-brand-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{ height }}
        className="flex flex-col items-center justify-center gap-2 text-center"
      >
        <LuTriangleAlert className="size-6 text-red-500" />
        <p className="text-xs text-slate-500">{error}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <LuRefreshCw className="size-3.5" />
            Retry
          </button>
        )}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center text-sm text-slate-400"
      >
        {emptyMessage}
      </div>
    );
  }

  return <div style={{ height }}>{children}</div>;
};

export { ChartFrame };
