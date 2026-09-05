'use client';

import { type FormEvent, useEffect, useState } from 'react';

import { InputField } from '../../../form/fields/InputField';
import { AlertBanner } from '../../../ui/AlertBanner';
import { Modal } from '../../../ui/modal/Modal';
import { useCreateBlogTag, useUpdateBlogTag } from '../hooks';
import type { BlogTag } from '../types';

type TagFormModalProps = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  /** Present when editing an existing tag; absent when creating one —
   * one modal serves both, same spirit as UploadFileModal being the
   * only "create" surface Storage Files needs. */
  tag?: BlogTag | null;
};

/** A tag is just a name — a modal is proportionate here, not a full
 * create/edit page pair like Categories/Classifications get for their
 * richer forms. */
const TagFormModal = ({ open, onClose, onSaved, tag }: TagFormModalProps) => {
  const { execute: createTag, loading: creating } = useCreateBlogTag();
  const { execute: updateTag, loading: updating } = useUpdateBlogTag();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const submitting = creating || updating;
  const isEdit = Boolean(tag);

  useEffect(() => {
    if (open) setName(tag?.name ?? '');
    setError('');
  }, [open, tag]);

  const handleClose = () => {
    setError('');
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    try {
      if (tag) {
        await updateTag(tag.id, name.trim());
      } else {
        await createTag(name.trim());
      }
      onSaved();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the tag.');
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEdit ? 'Edit tag' : 'New tag'}
      footer={
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="tag-form"
            disabled={submitting}
            className="flex-1 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Saving…' : 'Save'}
          </button>
        </div>
      }
    >
      <form id="tag-form" onSubmit={handleSubmit} noValidate>
        <AlertBanner message={error} />
        <InputField
          label="Name"
          field="name"
          formData={{ name }}
          updateFormData={(_field, value) => setName(value)}
          disabled={submitting}
        />
      </form>
    </Modal>
  );
};

export { TagFormModal };
