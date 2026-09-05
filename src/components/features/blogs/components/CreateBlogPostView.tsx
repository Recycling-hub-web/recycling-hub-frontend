'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { LuArrowLeft } from 'react-icons/lu';

import { InputField } from '../../../form/fields/InputField';
import { SelectField } from '../../../form/fields/SelectField';
import { TextareaField } from '../../../form/fields/TextareaField';
import { PageContainer } from '../../../layout/PageContainer';
import { AlertBanner } from '../../../ui/AlertBanner';
import { Button } from '../../../ui/buttons/Button';
import { Card } from '../../../ui/card/Card';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
import { NONE_CATEGORY } from '../constants';
import { useCreateBlogPost, usePostCategories } from '../hooks';
import type { CoverImage } from '../types';
import { CoverImageUploader } from './CoverImageUploader';

type FormState = {
  title: string;
  category: string;
  content: string;
};

const INITIAL_STATE: FormState = {
  title: '',
  category: NONE_CATEGORY,
  content: '',
};

type CreateBlogPostViewProps = {
  basePath: '/admin/blogs' | '/staff/blogs';
};

// Full page, not a modal — same footing as CreateCategoryView. New posts
// are always created as Draft (the model default) — Status only becomes
// editable on the edit form, same precedent as Categories' is_active.
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
  const categoryOptions = usePostCategories();

  const updateFormData = (field: string, value: string) => {
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
        category:
          formData.category === NONE_CATEGORY ? null : formData.category,
        cover_image: coverImage?.file_key ?? '',
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
