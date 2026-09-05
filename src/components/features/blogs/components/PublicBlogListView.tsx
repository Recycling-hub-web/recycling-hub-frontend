'use client';

import Link from 'next/link';
import { useState } from 'react';
import { LuArrowRight, LuNewspaper } from 'react-icons/lu';

import { AppDate } from '../../../ui/date/AppDate';
import { FadeIn } from '../../../ui/FadeIn';
import { Loading } from '../../../ui/loading/Loading';
import { useBlogPosts } from '../hooks';

const PAGE_SIZE = 12;

// content has no separate excerpt field — same truncation spirit as
// admin's table cells, just for prose instead of a table cell.
const excerpt = (content: string, max = 160) =>
  content.length > max ? `${content.slice(0, max).trimEnd()}…` : content;

/** Public — the presigned-upload/status-filter machinery from the admin
 * BlogPostsView doesn't apply here, so this is its own component rather
 * than reusing BlogPostsView with a "public mode" flag. Anonymous
 * requests to GET /blogs/ already only ever return published posts
 * (BlogPostViewSet.get_queryset), so useBlogPosts needs no `status`
 * param — the same hook, safely reused as-is. */
const PublicBlogListView = () => {
  const [page, setPage] = useState(1);
  const { posts, count, loading, error, refetch } = useBlogPosts({ page });
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  if (loading) return <Loading text="Loading posts…" />;

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16 text-center md:px-8">
        <p className="text-sm text-red-600">{error}</p>
        <button
          type="button"
          onClick={refetch}
          className="mt-3 text-sm font-semibold text-brand-600 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16 text-center md:px-8">
        <LuNewspaper className="mx-auto size-8 text-slate-300" />
        <p className="mt-3 text-sm text-slate-500">
          No posts published yet — check back soon.
        </p>
      </div>
    );
  }

  return (
    <section className="bg-white pb-16 md:pb-20">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <FadeIn key={post.id} delay={i * 0.06}>
              <Link
                href={`/resources/blog/${post.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-neutral-50 transition-colors duration-200 hover:border-brand-600 hover:bg-white"
              >
                {post.cover_image?.public_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.cover_image.public_url}
                    alt=""
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-40 w-full items-center justify-center bg-brand-50 text-brand-300">
                    <LuNewspaper size={32} />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  {post.published_at && (
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                      <AppDate value={post.published_at} format="long" />
                    </p>
                  )}
                  <h3 className="mt-2 font-montserrat text-base font-extrabold text-neutral-950">
                    {post.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-500">
                    {excerpt(post.content)}
                  </p>
                  <p className="mt-5 flex items-center gap-1 text-xs font-semibold text-brand-600">
                    Read more <LuArrowRight className="size-3.5" />
                  </p>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-sm text-slate-400">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export { PublicBlogListView };
