'use client';

import { useEffect, useMemo, useState } from 'react';
import { LuPlus } from 'react-icons/lu';

import { ApiError } from '../../../../lib/api';
import { SearchInput } from '../../../form/filter/SearchInput';
import { PageContainer } from '../../../layout/PageContainer';
import { Button } from '../../../ui/buttons/Button';
import { FilterSelect } from '../../../ui/FilterSelect';
import { ConfirmModal } from '../../../ui/modal/ConfirmModal';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
import { NONE_CATEGORY, STATUS_FILTER_OPTIONS } from '../constants';
import { useBlogPosts, useDeleteBlogPost, usePostCategories } from '../hooks';
import type { BlogPost, BlogStatus } from '../types';
import { BlogPostTable } from './BlogPostTable';

const SEARCH_DEBOUNCE_MS = 350;

type BlogPostsViewProps = {
  basePath: '/admin/blogs' | '/staff/blogs';
};

/** One list view shared by /admin/blogs and /staff/blogs — same data,
 * same table. Admin and staff have identical permissions here
 * (BlogPostViewSet + IsStaffOrReadOnly), so no canDelete prop. */
const BlogPostsView = ({ basePath }: BlogPostsViewProps) => {
  const toast = useToast();

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<BlogStatus | ''>('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [pendingDelete, setPendingDelete] = useState<BlogPost | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const { posts, count, loading, error, refetch } = useBlogPosts({
    page,
    status: statusFilter || undefined,
    search: search || undefined,
  });
  const { execute: deletePost, loading: deleting } = useDeleteBlogPost();
  const categoryOptions = usePostCategories();

  const categoryNameById = useMemo(
    () =>
      Object.fromEntries(
        categoryOptions
          .filter((o) => o.value !== NONE_CATEGORY)
          .map((o) => [o.value, o.label]),
      ),
    [categoryOptions],
  );

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as BlogStatus | '');
    setPage(1);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deletePost(pendingDelete.id);
      toast.success(
        'Post archived',
        `"${pendingDelete.title}" has been archived.`,
      );
      setPendingDelete(null);
      refetch();
    } catch (err) {
      toast.error(
        'Could not archive the post',
        err instanceof ApiError ? err.message : undefined,
      );
    }
  };

  return (
    <PageContainer variant="table">
      <PageHeader
        title="Blog Posts"
        subtitle="Manage the posts shown on the public blog."
        actions={
          <>
            <Button href={`${basePath}/tags`} variant="secondary">
              Manage tags
            </Button>
            <Button href={`${basePath}/create`}>
              <LuPlus className="mr-1.5 size-4" />
              New post
            </Button>
          </>
        }
      />

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by title…"
          className="sm:max-w-xs"
        />
        <FilterSelect
          value={statusFilter}
          onChange={handleStatusFilterChange}
          options={STATUS_FILTER_OPTIONS}
        />
      </div>

      <BlogPostTable
        posts={posts}
        count={count}
        page={page}
        onPageChange={setPage}
        statusFilter={statusFilter}
        search={search}
        loading={loading}
        error={error}
        onRetry={refetch}
        basePath={basePath}
        categoryNameById={categoryNameById}
        onDeleteRequest={setPendingDelete}
      />

      <ConfirmModal
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Archive post"
        message={`This archives "${pendingDelete?.title}" — it stays visible here as Archived and can be republished later, but it's removed from the public blog.`}
        confirmText="Archive"
        confirmVariant="danger"
        loading={deleting}
      />
    </PageContainer>
  );
};

export { BlogPostsView };
