'use client';

import { useState } from 'react';
import { LuFileVideo, LuImage, LuTrash2, LuUpload } from 'react-icons/lu';

import { AlertBanner } from '../../../ui/AlertBanner';
import { useToast } from '../../../ui/toast/ToastContext';
import { useUploadStorageFile } from '../../storageFiles/hooks';
import { MEDIA_TYPE_LABELS, MEDIA_TYPE_OPTIONS } from '../constants';
import {
  useBlogMediaList,
  useCreateBlogMedia,
  useDeleteBlogMedia,
} from '../hooks';
import type { BlogMediaType } from '../types';

type PostMediaManagerProps = {
  blogId: string;
};

/** Applies the same presigned-upload flow as CoverImageUploader/Storage
 * Files to a repeating list instead of a single value — each item POSTs
 * to /blogs/media/ (BlogMediaViewSet) once the upload itself succeeds.
 * Only rendered on the edit page, never create — BlogMedia requires a
 * real blog id to attach to. */
const PostMediaManager = ({ blogId }: PostMediaManagerProps) => {
  const toast = useToast();
  const { media, loading, error, refetch } = useBlogMediaList(blogId);
  const {
    execute: upload,
    loading: uploading,
    error: uploadError,
  } = useUploadStorageFile();
  const { execute: attachMedia } = useCreateBlogMedia();
  const { execute: removeMedia } = useDeleteBlogMedia();
  const [type, setType] = useState<BlogMediaType>('gallery');

  const handleFileChange = async (file: File | undefined) => {
    if (!file) return;
    try {
      const result = await upload(file);
      await attachMedia({ blog: blogId, type, file_key: result.file_key });
      toast.success('Media attached');
      refetch();
    } catch {
      // useUploadStorageFile/useCreateBlogMedia already captured the
      // message — shown via uploadError below.
    }
  };

  const handleRemove = async (id: string, label: string) => {
    try {
      await removeMedia(id);
      toast.success('Media removed', `"${label}" has been removed.`);
      refetch();
    } catch {
      toast.error('Could not remove this media item');
    }
  };

  return (
    <div className="mb-4" data-field="media">
      <label className="block text-sm font-medium text-slate-900">Media</label>

      <div className="mt-2 space-y-3">
        <AlertBanner message={uploadError} />
        {error && <AlertBanner message={error} />}

        {loading ? (
          <p className="text-sm text-slate-400">Loading media…</p>
        ) : (
          media.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {media.map((item) => (
                <div
                  key={item.id}
                  className="relative overflow-hidden rounded-xl border border-slate-200"
                >
                  {item.file_key?.public_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.file_key.public_url}
                      alt={item.alt_text}
                      className="h-24 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-24 w-full items-center justify-center bg-slate-100 text-slate-400">
                      {item.type === 'video_thumbnail' ? (
                        <LuFileVideo className="size-6" />
                      ) : (
                        <LuImage className="size-6" />
                      )}
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-2 bg-white px-2 py-1.5">
                    <span className="truncate text-xs text-slate-500">
                      {MEDIA_TYPE_LABELS[item.type]}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleRemove(item.id, item.alt_text || item.type)
                      }
                      aria-label="Remove media"
                      className="inline-flex size-6 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <LuTrash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as BlogMediaType)}
            disabled={uploading}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-brand-500 disabled:opacity-60"
          >
            {MEDIA_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <label
            htmlFor="post-media-input"
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-dashed border-slate-300 px-4 py-2 text-sm text-slate-600 transition hover:border-brand-300 hover:bg-slate-50 ${
              uploading ? 'pointer-events-none opacity-50' : ''
            }`}
          >
            <LuUpload className="size-4" />
            {uploading ? 'Uploading…' : 'Add media'}
          </label>
          <input
            id="post-media-input"
            type="file"
            className="sr-only"
            disabled={uploading}
            onChange={(e) => handleFileChange(e.target.files?.[0])}
          />
        </div>
      </div>
    </div>
  );
};

export { PostMediaManager };
