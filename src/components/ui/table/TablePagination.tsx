import { LuArrowLeft, LuArrowRight } from 'react-icons/lu';

type TablePaginationProps = {
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  itemCount: number;
  totalCount: number;
  itemLabel: string;
  loading?: boolean;
};

const navButtonClassName =
  'flex items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50';

// Prev/Next were originally two near-identical copy-pasted button files
// (differing only in icon-before-vs-after-text) — folded into this
// component since it's their only caller, rather than keeping two files
// that both exported a component internally named `Button`.
const TablePagination = ({
  currentPage,
  onPageChange,
  itemsPerPage,
  itemCount,
  totalCount,
  itemLabel,
  loading,
}: TablePaginationProps) => {
  const displayTotal =
    itemCount < itemsPerPage
      ? (currentPage - 1) * itemsPerPage + itemCount
      : totalCount;
  const totalPages = Math.max(Math.ceil(displayTotal / itemsPerPage), 1);

  return (
    <div className="flex flex-col items-center justify-between gap-2 border-t border-slate-200 p-6 text-sm text-slate-500 sm:flex-row">
      {itemCount === 0 && !loading ? (
        <span />
      ) : (
        <span>
          Showing{' '}
          <span className="font-medium text-slate-700">
            {(currentPage - 1) * itemsPerPage + 1}
          </span>{' '}
          to{' '}
          <span className="font-medium text-slate-700">
            {(currentPage - 1) * itemsPerPage + itemCount}
          </span>{' '}
          of <span className="font-medium text-slate-700">{displayTotal}</span>{' '}
          {itemLabel}
        </span>
      )}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className={navButtonClassName}
        >
          <LuArrowLeft className="size-4" />
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={itemCount < itemsPerPage}
          className={navButtonClassName}
        >
          Next
          <LuArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
};

export { TablePagination };
export type { TablePaginationProps };
