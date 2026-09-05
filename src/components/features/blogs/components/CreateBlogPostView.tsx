'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { LuArrowLeft } from 'react-icons/lu';

import { CheckSimpleBoxGroup } from '../../../form/fields/CheckSimpleBoxGroup';
import { InputField } from '../../../form/fields/InputField';
import { SelectField } from '../../../form/fields/SelectField';
import { TextareaField } from '../../../form/fields/TextareaField';
import { SettingToggleInput } from '../../../form/toggle/SettingToggleInput';
import { PageContainer } from '../../../layout/PageContainer';
import { AlertBanner } from '../../../ui/AlertBanner';
import { Button } from '../../../ui/buttons/Button';
import { Card } from '../../../ui/card/Card';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
import {
  CONTENT_TYPE_OPTIONS,
  DIFFICULTY_OPTIONS,
  NONE_CATEGORY,
  NONE_DIFFICULTY,
  VISIBILITY_OPTIONS,
} from '../constants';
import { useBlogTags, useCreateBlogPost, usePostCategories } from '../hooks';
import type {
  BlogContentType,
  BlogDifficultyLevel,
  BlogVisibility,
  CoverImage,
} from '../types';
import { CoverImageUploader } from './CoverImageUploader';

type FormState = {
  title: string;
  category: string;
  content_type: BlogContentType;
  visibility: BlogVisibility;
  difficulty_level: string;
  location: string;
  content: string;
  excerpt: string;
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

const INITIAL_STATE: FormState = {
  title: '',
  category: NONE_CATEGORY,
  content_type: 'article',
  visibility: 'public',
  difficulty_level: NONE_DIFFICULTY,
  location: '',
  content: '',
  excerpt: '',
  is_featured: false,
  allow_comments: true,
  meta_title: '',
  meta_description: '',
  canonical_url: '',
  og_title: '',
  og_description: '',
  og_image: '',
  no_index: false,
};

type CreateBlogPostViewProps = {
  basePath: '/admin/blogs' | '/staff/blogs';
};

// Full page, not a modal — same footing as CreateCategoryView. New posts
// are always created as Draft (the model default) — Status only becomes
// editable on the edit form, same precedent as Categories' is_active.
// Media and Related Posts aren't offered here either — both need a real
// post id to attach to, so they're edit-only (PostMediaManager/the
// related-posts picker).
const CreateBlogPostView = ({ basePath }: CreateBlogPostViewProps) => {
  const router = useRouter();
  const toast = useToast();
  const {
    execute: createPost,
    loading: submitting,
    error,
  } = useCreateBlogPost();
  const [formData, setFormData] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [coverImage, setCoverImage] = useState<CoverImage>(null);
  const [tagIds, setTagIds] = useState<string[]>([]);
  const categoryOptions = usePostCategories();
  const { tags: tagOptions } = useBlogTags();

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
    // Validation error: stay on this page, keep entered values, show
    // inline errors — never navigate away.
    if (!validate(formData)) return;

    try {
      const post = await createPost({
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt || undefined,
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
      });
      toast.success('Post created', `"${formData.title}" has been added.`);
      router.push(`${basePath}/${post.id}`);
    } catch {
      // useCreateBlogPost already captured the message in `error`, shown below.
    }
  };

  return (
    <PageContainer variant="form">
      <Link
        href={basePath}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <LuArrowLeft className="size-4" />
        Back to blog posts
      </Link>

      <PageHeader title="New post" subtitle="Add a post to the public blog." />

      <Card className="p-5">
        <form onSubmit={handleSubmit}>
          <AlertBanner message={error} />

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
            <Button href={basePath} variant="secondary" className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting ? 'Creating…' : 'Create post'}
            </Button>
          </div>
        </form>
      </Card>
    </PageContainer>
  );
};

export { CreateBlogPostView };
