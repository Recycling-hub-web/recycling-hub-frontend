type TableSkeletonRowsProps = {
  columns: number;
  rows?: number;
};

const TableSkeletonRows = ({ columns, rows = 5 }: TableSkeletonRowsProps) => (
  <>
    {Array.from({ length: rows }).map((_row, rowIndex) => (
      // Static placeholder rows that never reorder — index keys are fine here.
      <tr key={rowIndex}>
        {Array.from({ length: columns }).map((_col, colIndex) => (
          <td key={colIndex} className="px-6 py-4">
            <div
              className="h-4 animate-pulse rounded bg-slate-200"
              style={{ width: colIndex === 0 ? '70%' : '50%' }}
            />
          </td>
        ))}
      </tr>
    ))}
  </>
);

export { TableSkeletonRows };
export type { TableSkeletonRowsProps };
