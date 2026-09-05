'use client';

import Link from 'next/link';
import { LuArrowLeft } from 'react-icons/lu';

import { AppDate } from '../../../ui/date/AppDate';
import { FadeIn } from '../../../ui/FadeIn';
import { Loading } from '../../../ui/loading/Loading';
import { useBlogPost } from '../hooks';

type PublicBlogPostViewProps = {
  slug: string;
};

/** Public — `useBlogPost` already works by slug or id (the backend's
 * BlogPostViewSet.get_object tries a slug lookup before falling back to
 * pk, same pattern as CategoryViewSet), so this reuses the admin hook
 * as-is rather than adding a parallel one. Anonymous requests to
 * GET /blogs/<slug>/ 404 for anything not published
 * (BlogPostViewSet.get_queryset), so there's no risk of a draft leaking
 * through this page. */
const PublicBlogPostView = ({ slug }: PublicBlogPostViewProps) => {
  const { post, loading, error } = useBlogPost(slug);

  // pt-[calc(70px+2.5rem)] clears the Navbar's fixed positioning in every
  // state this page can render — same value ReusableHero uses, since
  // this page has no hero of its own to do that automatically.
  if (loading) {
    return (
      <div className="pt-[calc(70px+2.5rem)] md:pt-[calc(80px+3.5rem)]">
        <Loading text="Loading post…" />
      </div>
    );
  }

  if (error || !post) {
    // Always the same friendly copy here, regardless of what the API
    // actually said (a raw "Not found." reads fine in an admin CRUD
    // error banner, not to a visitor who followed an old link) — a
    // missing post and a real network error look the same to them.
    return (
      <div className="mx-auto max-w-3xl px-5 pb-16 pt-[calc(70px+2.5rem)] text-center md:px-8 md:pt-[calc(80px+3.5rem)]">
        <p className="text-sm text-slate-500">
          This post doesn&apos;t exist or isn&apos;t published.
        </p>
        <Link
          href="/resources/blog"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600"
        >
          <LuArrowLeft className="size-4" />
          Back to the blog
        </Link>
      </div>
    );
  }

  return (
    // pt-[calc(70px+2.5rem)] clears the Navbar's fixed positioning — same
    // value ReusableHero uses, since this page has no hero of its own to
    // do that automatically.
    <article className="bg-white pb-16 pt-[calc(70px+2.5rem)] md:pb-20 md:pt-[calc(80px+3.5rem)]">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <Link
          href="/resources/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
        >
          <LuArrowLeft className="size-4" />
          Back to the blog
        </Link>

        <FadeIn>
          <h1 className="mt-6 font-montserrat text-3xl font-extrabold tracking-[-0.02em] text-neutral-950 md:text-4xl">
            {post.title}
          </h1>
          {post.published_at && (
            <p className="mt-3 text-sm text-slate-400">
              <AppDate value={post.published_at} format="long" />
            </p>
          )}
        </FadeIn>

        {post.cover_image?.public_url && (
          <FadeIn delay={0.1}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.cover_image.public_url}
              alt=""
              className="mt-8 h-64 w-full rounded-2xl object-cover md:h-96"
            />
          </FadeIn>
        )}

        <FadeIn delay={0.15}>
          <p className="mt-8 whitespace-pre-wrap text-base leading-relaxed text-slate-700">
            {post.content}
          </p>
        </FadeIn>
      </div>
    </article>
  );
};

export { PublicBlogPostView };
