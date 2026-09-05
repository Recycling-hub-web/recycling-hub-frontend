'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { LuArrowLeft } from 'react-icons/lu';

import { ApiError } from '../../../../lib/api';
import { InputField } from '../../../form/fields/InputField';
import { SelectField } from '../../../form/fields/SelectField';
import { TextareaField } from '../../../form/fields/TextareaField';
import { PageContainer } from '../../../layout/PageContainer';
import { AlertBanner } from '../../../ui/AlertBanner';
import { Button } from '../../../ui/buttons/Button';
import { Card } from '../../../ui/card/Card';
import { Loading } from '../../../ui/loading/Loading';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
import { NONE_CATEGORY, STATUS_OPTIONS } from '../constants';
import { useBlogPost, usePostCategories, useUpdateBlogPost } from '../hooks';
import type { BlogStatus, CoverImage } from '../types';
import { CoverImageUploader } from './CoverImageUploader';

type FormState = {
  title: string;
  category: string;
  content: string;
  status: BlogStatus;
};

type EditBlogPostViewProps = {
  postId: string;
  basePath: '/admin/blogs' | '/staff/blogs';
};

const EditBlogPostView = ({ postId, basePath }: EditBlogPostViewProps) => {
  const router = useRouter();
  const toast = useToast();
  const { post, loading: loadingPost, error: loadError } = useBlogPost(postId);
  const { execute: updatePost, loading: submitting } = useUpdateBlogPost();
  const [formData, setFormData] = useState<FormState | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [coverImage, setCoverImage] = useState<CoverImage>(null);
  const categoryOptions = usePostCategories();

  useEffect(() => {
    if (!post) return;
    setFormData({
      title: post.title,
      category: post.category ?? NONE_CATEGORY,
      content: post.content,
      status: post.status,
    });
    setCoverImage(post.cover_image);
  }, [post]);

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = (data: FormState): boolean => {
    const nextErrors: Record<string, string> = {};
    if (!data.title.trim()) nextErrors.title = 'Title is required.';
    if (!data.content.trim()) nextErrors.content = 'Content is required.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData || !post) return;
    setApiError('');
    // Validation error: stay on this page, keep entered values, show
    // inline errors — never navigate away.
    if (!validate(formData)) return;

    try {
      await updatePost(post.id, {
        title: formData.title,
        content: formData.content,
        category:
          formData.category === NONE_CATEGORY ? null : formData.category,
        cover_image: coverImage?.file_key ?? '',
        status: formData.status,
      });
      toast.success('Post updated');
      router.push(`${basePath}/${post.id}`);
    } catch (err) {
      setApiError(
        err instanceof ApiError ? err.message : 'Could not save this post.',
      );
    }
  };

  if (loadingPost) return <Loading text="Loading post…" />;

  if (loadError || !post || !formData) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {loadError || 'Post not found.'}
      </div>
    );
  }

  // `post` is the snapshot useBlogPost loaded — this component never
  // refetches it mid-edit, so comparing formData against it directly is
  // a safe, real dirty-check, not just a first-render diff.
  const hasChanges =
    formData.title !== post.title ||
    formData.content !== post.content ||
    formData.category !== (post.category ?? NONE_CATEGORY) ||
    formData.status !== post.status ||
    (coverImage?.file_key ?? null) !== (post.cover_image?.file_key ?? null);

  return (
    <PageContainer variant="form">
      <Link
        href={`${basePath}/${post.id}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <LuArrowLeft className="size-4" />
        Back to post
      </Link>

      <PageHeader title="Edit post" subtitle={post.title} />

      <Card className="p-5">
        <form onSubmit={handleSubmit}>
          <AlertBanner message={apiError} />

          <div className="grid gap-x-4 sm:grid-cols-2">
            <InputField
              label="Title"
              field="title"
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <SelectField
              label="Category"
              field="category"
              required={false}
              options={categoryOptions}
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <SelectField
              label="Status"
              field="status"
              options={STATUS_OPTIONS}
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <div className="sm:col-span-2">
              <CoverImageUploader
                value={coverImage}
                onChange={(fileKey) =>
                  setCoverImage(
                    fileKey ? { file_key: fileKey, public_url: null } : null,
                  )
                }
                disabled={submitting}
              />
            </div>
            <div className="sm:col-span-2">
              <TextareaField
                label="Content"
                field="content"
                formData={formData}
                errors={errors}
                updateFormData={updateFormData}
              />
            </div>
          </div>

          <div className="flex gap-5 pt-2">
            <Button
              href={`${basePath}/${post.id}`}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || !hasChanges}
              className="flex-1"
            >
              {submitting ? 'Saving…' : 'Save changes'}
            </Button>
          </div>
        </form>
      </Card>
    </PageContainer>
  );
};

export { EditBlogPostView };
