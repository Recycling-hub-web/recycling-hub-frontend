'use client';

import { LuPencil, LuTags, LuTrash2 } from 'react-icons/lu';

import {
  TableEmptyRow,
  TableErrorRow,
  TableLoadingRow,
  TableWrapper,
} from '../../../ui/table';
import type { BlogTag } from '../types';

type BlogTagTableProps = {
  tags: BlogTag[];
  search?: string;
  loading: boolean;
  error: string;
  onRetry: () => void;
  onEditRequest: (tag: BlogTag) => void;
  onDeleteRequest: (tag: BlogTag) => void;
};

/** Pure presentational — no pagination (BlogTagViewSet isn't expected
 * to ever need it at this scale, unlike the post/category/classification
 * lists). */
const BlogTagTable = ({
  tags,
  search,
  loading,
  error,
  onRetry,
  onEditRequest,
  onDeleteRequest,
}: BlogTagTableProps) => {
  const columnCount = 3;

  const renderRows = () => {
    if (loading) return <TableLoadingRow colSpan={columnCount} />;
    if (error)
      return (
        <TableErrorRow
          colSpan={columnCount}
          message={error}
          onRetry={onRetry}
        />
      );
    if (tags.length === 0) {
      return (
        <TableEmptyRow
          colSpan={columnCount}
          title="No tags found"
          subtitle={search ? `No matches for "${search}".` : undefined}
        />
      );
    }
    return tags.map((tag) => (
      <tr key={tag.id} className="transition-colors hover:bg-slate-50">
        <td className="px-6 py-4 font-medium text-slate-900">
          <span className="flex items-center gap-2">
            <LuTags className="size-4 text-slate-400" />
            {tag.name}
          </span>
        </td>
        <td className="px-6 py-4 text-slate-500">/{tag.slug}</td>
        <td className="px-6 py-4">
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => onEditRequest(tag)}
              aria-label={`Edit tag ${tag.name}`}
              className="inline-flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <LuPencil className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onDeleteRequest(tag)}
              aria-label={`Delete tag ${tag.name}`}
              className="inline-flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-600"
            >
              <LuTrash2 className="size-4" />
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <TableWrapper>
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Name
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Slug
            </th>
            <th className="px-6 py-3 text-right font-semibold text-slate-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{renderRows()}</tbody>
      </table>
    </TableWrapper>
  );
};

export { BlogTagTable };
