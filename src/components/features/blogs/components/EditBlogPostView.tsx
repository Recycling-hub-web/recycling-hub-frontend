'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { LuArrowLeft } from 'react-icons/lu';

import { ApiError } from '../../../../lib/api';
import { CheckSimpleBoxGroup } from '../../../form/fields/CheckSimpleBoxGroup';
import { InputField } from '../../../form/fields/InputField';
import { SelectField } from '../../../form/fields/SelectField';
import { TextareaField } from '../../../form/fields/TextareaField';
import { SettingToggleInput } from '../../../form/toggle/SettingToggleInput';
import { PageContainer } from '../../../layout/PageContainer';
import { AlertBanner } from '../../../ui/AlertBanner';
import { Button } from '../../../ui/buttons/Button';
import { Card } from '../../../ui/card/Card';
import { Loading } from '../../../ui/loading/Loading';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
import {
  CONTENT_TYPE_OPTIONS,
  DIFFICULTY_OPTIONS,
  NONE_CATEGORY,
  NONE_DIFFICULTY,
  STATUS_OPTIONS,
  VISIBILITY_OPTIONS,
} from '../constants';
import {
  useBlogPost,
  useBlogTags,
  usePostCategories,
  usePostOptions,
  useUpdateBlogPost,
} from '../hooks';
import type {
  BlogContentType,
  BlogDifficultyLevel,
  BlogStatus,
  BlogVisibility,
  CoverImage,
} from '../types';
import { CoverImageUploader } from './CoverImageUploader';
import { PostMediaManager } from './PostMediaManager';

type FormState = {
  title: string;
  category: string;
  content_type: BlogContentType;
  visibility: BlogVisibility;
  difficulty_level: string;
  location: string;
  content: string;
  excerpt: string;
  status: BlogStatus;
  is_featured: boolean;
  allow_comments: boolean;
  meta_title: string;
  meta_description: string;
  canonical_url: string;
  og_title: string;
  og_description: string;
  og_image: string;
  no_index: boolean;
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
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [relatedIds, setRelatedIds] = useState<string[]>([]);
  const categoryOptions = usePostCategories();
  const { tags: tagOptions } = useBlogTags();
  const postOptions = usePostOptions(postId);

  useEffect(() => {
    if (!post) return;
    setFormData({
      title: post.title,
      category: post.category ?? NONE_CATEGORY,
      content_type: post.content_type,
      visibility: post.visibility,
      difficulty_level: post.difficulty_level ?? NONE_DIFFICULTY,
      location: post.location,
      content: post.content,
      excerpt: post.excerpt,
      status: post.status,
      is_featured: post.is_featured,
      allow_comments: post.allow_comments,
      meta_title: post.meta_title,
      meta_description: post.meta_description,
      canonical_url: post.canonical_url,
      og_title: post.og_title,
      og_description: post.og_description,
      og_image: post.og_image,
      no_index: post.no_index,
    });
    setCoverImage(post.cover_image);
    setTagIds(post.tags);
    setRelatedIds(post.related_blogs.map((p) => p.id));
  }, [post]);

  const updateFormData = (field: string, value: string | boolean) => {
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
        excerpt: formData.excerpt,
        category:
          formData.category === NONE_CATEGORY ? null : formData.category,
        cover_image: coverImage?.file_key ?? '',
        content_type: formData.content_type,
        visibility: formData.visibility,
        difficulty_level:
          formData.difficulty_level === NONE_DIFFICULTY
            ? null
            : (formData.difficulty_level as BlogDifficultyLevel),
        location: formData.location,
        status: formData.status,
        is_featured: formData.is_featured,
        allow_comments: formData.allow_comments,
        meta_title: formData.meta_title,
        meta_description: formData.meta_description,
        canonical_url: formData.canonical_url,
        og_title: formData.og_title,
        og_description: formData.og_description,
        og_image: formData.og_image,
        no_index: formData.no_index,
        tags: tagIds,
        related_blog_ids: relatedIds,
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
  // a safe, real dirty-check, not just a first-render diff. Media isn't
  // part of this check — PostMediaManager saves each item immediately
  // on its own, it doesn't wait for this form's Save.
  const sortedTagIds = [...tagIds].sort();
  const sortedOriginalTagIds = [...post.tags].sort();
  const sortedRelatedIds = [...relatedIds].sort();
  const sortedOriginalRelatedIds = [
    ...post.related_blogs.map((p) => p.id),
  ].sort();
  const hasChanges =
    formData.title !== post.title ||
    formData.content !== post.content ||
    formData.excerpt !== post.excerpt ||
    formData.category !== (post.category ?? NONE_CATEGORY) ||
    formData.content_type !== post.content_type ||
    formData.visibility !== post.visibility ||
    formData.difficulty_level !== (post.difficulty_level ?? NONE_DIFFICULTY) ||
    formData.location !== post.location ||
    formData.status !== post.status ||
    formData.is_featured !== post.is_featured ||
    formData.allow_comments !== post.allow_comments ||
    formData.meta_title !== post.meta_title ||
    formData.meta_description !== post.meta_description ||
    formData.canonical_url !== post.canonical_url ||
    formData.og_title !== post.og_title ||
    formData.og_description !== post.og_description ||
    formData.og_image !== post.og_image ||
    formData.no_index !== post.no_index ||
    (coverImage?.file_key ?? null) !== (post.cover_image?.file_key ?? null) ||
    JSON.stringify(sortedTagIds) !== JSON.stringify(sortedOriginalTagIds) ||
    JSON.stringify(sortedRelatedIds) !==
      JSON.stringify(sortedOriginalRelatedIds);

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
              label="Content type"
              field="content_type"
              options={CONTENT_TYPE_OPTIONS}
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <SelectField
              label="Difficulty level"
              field="difficulty_level"
              required={false}
              options={DIFFICULTY_OPTIONS}
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <SelectField
              label="Visibility"
              field="visibility"
              options={VISIBILITY_OPTIONS}
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
            <InputField
              label="Location"
              field="location"
              required={false}
              placeholder="Optional — e.g. Klang Valley"
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

            {tagOptions.length > 0 && (
              <div className="sm:col-span-2">
                <CheckSimpleBoxGroup
                  label="Tags"
                  field="tags"
                  options={tagOptions}
                  formData={{ tags: tagIds }}
                  updateFormData={(_field, value) =>
                    setTagIds(value as string[])
                  }
                />
              </div>
            )}

            {postOptions.length > 0 && (
              <div className="sm:col-span-2">
                <CheckSimpleBoxGroup
                  label="Related posts"
                  field="related"
                  options={postOptions}
                  formData={{ related: relatedIds }}
                  updateFormData={(_field, value) =>
                    setRelatedIds(value as string[])
                  }
                />
              </div>
            )}

            <div className="sm:col-span-2">
              <TextareaField
                label="Excerpt"
                field="excerpt"
                required={false}
                placeholder="Optional — auto-filled from the content if left blank."
                formData={formData}
                errors={errors}
                updateFormData={updateFormData}
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

            <div className="sm:col-span-2">
              <PostMediaManager blogId={post.id} />
            </div>

            <SettingToggleInput
              label="Featured"
              field="is_featured"
              formData={formData}
              updateFormData={updateFormData}
              enabledText="Featured"
              disabledText="Not featured"
              enabledDescription="Shown in featured spots"
              disabledDescription="Click to feature this post"
            />
            <SettingToggleInput
              label="Comments"
              field="allow_comments"
              formData={formData}
              updateFormData={updateFormData}
              enabledText="Allowed"
              disabledText="Disabled"
              enabledDescription="Readers can comment"
              disabledDescription="Comments are turned off"
            />
          </div>

          <div className="mt-5 border-t border-slate-100 pt-5">
            <p className="mb-3 text-sm font-semibold text-slate-900">SEO</p>
            <div className="grid gap-x-4 sm:grid-cols-2">
              <InputField
                label="Meta title"
                field="meta_title"
                required={false}
                placeholder="Falls back to the post title."
                formData={formData}
                errors={errors}
                updateFormData={updateFormData}
                disabled={submitting}
              />
              <InputField
                label="Canonical URL"
                field="canonical_url"
                required={false}
                formData={formData}
                errors={errors}
                updateFormData={updateFormData}
                disabled={submitting}
              />
              <div className="sm:col-span-2">
                <TextareaField
                  label="Meta description"
                  field="meta_description"
                  required={false}
                  formData={formData}
                  errors={errors}
                  updateFormData={updateFormData}
                />
              </div>
              <InputField
                label="OG title"
                field="og_title"
                required={false}
                placeholder="Falls back to the meta title."
                formData={formData}
                errors={errors}
                updateFormData={updateFormData}
                disabled={submitting}
              />
              <InputField
                label="OG image URL"
                field="og_image"
                required={false}
                formData={formData}
                errors={errors}
                updateFormData={updateFormData}
                disabled={submitting}
              />
              <div className="sm:col-span-2">
                <TextareaField
                  label="OG description"
                  field="og_description"
                  required={false}
                  formData={formData}
                  errors={errors}
                  updateFormData={updateFormData}
                />
              </div>
              <SettingToggleInput
                label="Hide from search engines"
                field="no_index"
                formData={formData}
                updateFormData={updateFormData}
                enabledText="Hidden (noindex)"
                disabledText="Indexable"
                enabledDescription="Search engines are asked to skip this post"
                disabledDescription="Search engines may list this post"
              />
            </div>
          </div>

          <div className="flex gap-5 pt-5">
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
