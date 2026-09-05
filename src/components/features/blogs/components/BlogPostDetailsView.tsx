'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LuArrowLeft,
  LuCalendar,
  LuPencil,
  LuTag,
  LuTrash2,
} from 'react-icons/lu';

import { ApiError } from '../../../../lib/api';
import { PageContainer } from '../../../layout/PageContainer';
import { StatusBadge } from '../../../ui/badges/StatusBadge';
import type { DropdownItem } from '../../../ui/buttons/ActionsDropdown';
import { ActionsDropdown } from '../../../ui/buttons/ActionsDropdown';
import { Card } from '../../../ui/card/Card';
import { AppDate } from '../../../ui/date/AppDate';
import { InfoRow } from '../../../ui/InfoRow';
import { Loading } from '../../../ui/loading/Loading';
import { ConfirmModal } from '../../../ui/modal/ConfirmModal';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
import { STATUS_BADGE_VARIANT, STATUS_LABELS } from '../constants';
import { useBlogPost, useDeleteBlogPost } from '../hooks';
import { getCategoryName } from '../services/blogService';

type BlogPostDetailsViewProps = {
  postId: string;
  basePath: '/admin/blogs' | '/staff/blogs';
};

const BlogPostDetailsView = ({
  postId,
  basePath,
}: BlogPostDetailsViewProps) => {
  const router = useRouter();
  const toast = useToast();
  const { post, loading, error, refetch } = useBlogPost(postId);
  const { execute: deletePost, loading: deleting } = useDeleteBlogPost();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [categoryName, setCategoryName] = useState<string | null>(null);

  useEffect(() => {
    const categoryId = post?.category;
    if (!categoryId) {
      setCategoryName(null);
      return undefined;
    }
    let cancelled = false;
    getCategoryName(categoryId)
      .then((category) => {
        if (!cancelled) setCategoryName(category.name);
      })
      .catch(() => {
        if (!cancelled) setCategoryName(null);
      });
    return () => {
      cancelled = true;
    };
  }, [post?.category]);

  const handleConfirmDelete = async () => {
    if (!post) return;
    try {
      await deletePost(post.id);
      toast.success('Post archived', `"${post.title}" has been archived.`);
      refetch();
      setConfirmOpen(false);
    } catch (err) {
      toast.error(
        'Could not archive the post',
        err instanceof ApiError ? err.message : undefined,
      );
    }
  };

  if (loading) return <Loading text="Loading post…" />;

  if (error || !post) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error || 'Post not found.'}{' '}
        <button
          type="button"
          onClick={refetch}
          className="font-semibold underline"
        >
          Retry
        </button>
      </div>
    );
  }

  const actionItems: DropdownItem[] = [
    {
      label: 'Edit',
      icon: LuPencil,
      onClick: () => router.push(`${basePath}/${post.id}/edit`),
      color: 'neutral',
    },
    {
      label: 'Archive',
      icon: LuTrash2,
      onClick: () => setConfirmOpen(true),
      color: 'danger',
    },
  ];

  return (
    <PageContainer variant="form">
      <Link
        href={basePath}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <LuArrowLeft className="size-4" />
        Back to blog posts
      </Link>

      <PageHeader
        title={post.title}
        subtitle={`/${post.slug}`}
        actions={<ActionsDropdown items={actionItems} />}
      />

      <div className="mb-5">
        <StatusBadge variant={STATUS_BADGE_VARIANT[post.status]}>
          {STATUS_LABELS[post.status]}
        </StatusBadge>
      </div>

      {post.cover_image?.public_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.cover_image.public_url}
          alt=""
          className="mb-4 h-48 w-full rounded-xl object-cover"
        />
      )}

      <Card className="p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow
            icon={<LuTag className="size-4" />}
            label="Category"
            value={categoryName ?? (post.category ? 'Loading…' : 'None')}
          />
          <InfoRow
            icon={<LuCalendar className="size-4" />}
            label="Published"
            value={
              post.published_at ? (
                <AppDate value={post.published_at} format="long" />
              ) : (
                'Not published yet'
              )
            }
          />
        </div>

        <div className="mt-5 border-t border-slate-100 pt-5">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Content
          </p>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
            {post.content}
          </p>
        </div>

        {(post.title_ar || post.content_ar) && (
          <div className="mt-5 border-t border-slate-100 pt-5">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Arabic translation (auto-generated)
            </p>
            {post.title_ar && (
              <p dir="rtl" className="text-sm font-semibold text-slate-800">
                {post.title_ar}
              </p>
            )}
            {post.content_ar && (
              <p
                dir="rtl"
                className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-slate-700"
              >
                {post.content_ar}
              </p>
            )}
          </div>
        )}
      </Card>

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Archive post"
        message={`This archives "${post.title}" — it stays visible here as Archived and can be republished later, but it's removed from the public blog.`}
        confirmText="Archive"
        confirmVariant="danger"
        loading={deleting}
      />
    </PageContainer>
  );
};

export { BlogPostDetailsView };
