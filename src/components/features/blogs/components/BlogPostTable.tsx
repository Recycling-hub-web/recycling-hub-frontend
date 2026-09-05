'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LuEye, LuNewspaper, LuPencil, LuTrash2 } from 'react-icons/lu';

import { StatusBadge } from '../../../ui/badges/StatusBadge';
import { AppDate } from '../../../ui/date/AppDate';
import {
  TableEmptyRow,
  TableErrorRow,
  TableLoadingRow,
  TablePagination,
  TableWrapper,
} from '../../../ui/table';
import { STATUS_BADGE_VARIANT, STATUS_LABELS } from '../constants';
import type { BlogPost } from '../types';

const PAGE_SIZE = 12;

type BlogPostTableProps = {
  posts: BlogPost[];
  count: number;
  page: number;
  onPageChange: (page: number) => void;
  statusFilter: string;
  search?: string;
  loading: boolean;
  error: string;
  onRetry: () => void;
  /** /admin/blogs or /staff/blogs — one component serves both role
   * areas, same as every other table this session. */
  basePath: string;
  categoryNameById: Record<string, string>;
  onDeleteRequest: (post: BlogPost) => void;
};

/** Pure presentational — every value it renders is a prop. Admin and
 * staff have identical permissions here (BlogPostViewSet +
 * IsStaffOrReadOnly), so no canDelete gate. */
const BlogPostTable = ({
  posts,
  count,
  page,
  onPageChange,
  statusFilter,
  search,
  loading,
  error,
  onRetry,
  basePath,
  categoryNameById,
  onDeleteRequest,
}: BlogPostTableProps) => {
  const router = useRouter();
  const columnCount = 5;

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
    if (posts.length === 0) {
      let emptySubtitle: string | undefined;
      if (search) {
        emptySubtitle = `No matches for "${search}".`;
      } else if (statusFilter) {
        emptySubtitle = 'Try a different status filter.';
      }
      return (
        <TableEmptyRow
          colSpan={columnCount}
          title="No blog posts found"
          subtitle={emptySubtitle}
        />
      );
    }
    return posts.map((p) => (
      <tr
        key={p.id}
        onClick={() => router.push(`${basePath}/${p.id}`)}
        className="cursor-pointer transition-colors hover:bg-slate-50"
      >
        <td className="max-w-[280px] px-6 py-4 font-medium text-slate-900">
          <Link
            href={`${basePath}/${p.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2.5 truncate hover:text-brand-600 hover:underline"
          >
            {p.cover_image?.public_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.cover_image.public_url}
                alt=""
                className="size-8 shrink-0 rounded-lg object-cover"
              />
            ) : (
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                <LuNewspaper className="size-4" />
              </span>
            )}
            <span className="truncate">{p.title}</span>
          </Link>
        </td>
        <td className="max-w-[160px] truncate px-6 py-4 text-slate-500">
          {p.category ? categoryNameById[p.category] ?? '—' : '—'}
        </td>
        <td className="px-6 py-4">
          <StatusBadge variant={STATUS_BADGE_VARIANT[p.status]}>
            {STATUS_LABELS[p.status]}
          </StatusBadge>
        </td>
        <td className="px-6 py-4 text-slate-500">
          {p.published_at ? (
            <AppDate value={p.published_at} format="short" />
          ) : (
            '—'
          )}
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center justify-end gap-1">
            <Link
              href={`${basePath}/${p.id}`}
              onClick={(e) => e.stopPropagation()}
              aria-label={`View post ${p.title}`}
              className="inline-flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <LuEye className="size-4" />
            </Link>
            <Link
              href={`${basePath}/${p.id}/edit`}
              onClick={(e) => e.stopPropagation()}
              aria-label={`Edit post ${p.title}`}
              className="inline-flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <LuPencil className="size-4" />
            </Link>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteRequest(p);
              }}
              aria-label={`Delete post ${p.title}`}
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
    <TableWrapper
      footer={
        <TablePagination
          currentPage={page}
          onPageChange={onPageChange}
          itemsPerPage={PAGE_SIZE}
          itemCount={posts.length}
          totalCount={count}
          itemLabel="posts"
          loading={loading}
        />
      }
    >
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Title
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Category
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Status
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Published
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

export { BlogPostTable, PAGE_SIZE };
