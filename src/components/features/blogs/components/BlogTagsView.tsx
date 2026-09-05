'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LuArrowLeft, LuPlus } from 'react-icons/lu';

import { ApiError } from '../../../../lib/api';
import { SearchInput } from '../../../form/filter/SearchInput';
import { PageContainer } from '../../../layout/PageContainer';
import { Button } from '../../../ui/buttons/Button';
import { ConfirmModal } from '../../../ui/modal/ConfirmModal';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
import { useBlogTags, useDeleteBlogTag } from '../hooks';
import type { BlogTag } from '../types';
import { BlogTagTable } from './BlogTagTable';
import { TagFormModal } from './TagFormModal';

const SEARCH_DEBOUNCE_MS = 350;

type BlogTagsViewProps = {
  basePath: '/admin/blogs' | '/staff/blogs';
};

/** Reached from BlogPostsView's header, not its own sidebar entry — a
 * tag is just a name, this is a supplementary management screen nested
 * under Blogs, not a cross-cutting entity like Categories/
 * Classifications. Admin and staff have identical permissions here
 * (BlogTagViewSet + IsStaffOrReadOnly), so no canDelete prop. */
const BlogTagsView = ({ basePath }: BlogTagsViewProps) => {
  const toast = useToast();
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<BlogTag | null>(null);
  const [pendingDelete, setPendingDelete] = useState<BlogTag | null>(null);

  useEffect(() => {
    const timeout = setTimeout(
      () => setSearch(searchInput.trim()),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const { tags, loading, error, refetch } = useBlogTags(search || undefined);
  const { execute: deleteTag, loading: deleting } = useDeleteBlogTag();

  const handleSaved = () => {
    toast.success(editingTag ? 'Tag updated' : 'Tag created');
    refetch();
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteTag(pendingDelete.id);
      toast.success('Tag deleted', `"${pendingDelete.name}" has been removed.`);
      setPendingDelete(null);
      refetch();
    } catch (err) {
      toast.error(
        'Could not delete the tag',
        err instanceof ApiError ? err.message : undefined,
      );
    }
  };

  return (
    <PageContainer variant="table">
      <Link
        href={basePath}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <LuArrowLeft className="size-4" />
        Back to blog posts
      </Link>

      <PageHeader
        title="Blog Tags"
        subtitle="Manage the tags posts can be labeled with."
        actions={
          <Button
            onClick={() => {
              setEditingTag(null);
              setFormOpen(true);
            }}
          >
            <LuPlus className="mr-1.5 size-4" />
            New tag
          </Button>
        }
      />

      <div className="mb-4">
        <SearchInput
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name…"
          className="sm:max-w-xs"
        />
      </div>

      <BlogTagTable
        tags={tags}
        search={search}
        loading={loading}
        error={error}
        onRetry={refetch}
        onEditRequest={(tag) => {
          setEditingTag(tag);
          setFormOpen(true);
        }}
        onDeleteRequest={setPendingDelete}
      />

      <TagFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={handleSaved}
        tag={editingTag}
      />

      <ConfirmModal
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete tag"
        message={`This permanently deletes "${pendingDelete?.name}" and removes it from any posts it's attached to. This can't be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
        loading={deleting}
      />
    </PageContainer>
  );
};

export { BlogTagsView };
