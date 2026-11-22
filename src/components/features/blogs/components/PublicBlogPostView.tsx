'use client';

import Link from 'next/link';
import { LuArrowLeft } from 'react-icons/lu';

import { AppDate } from '../../../ui/date/AppDate';
import type { BlogPost } from '../types';

type PublicBlogPostViewProps = {
  post: BlogPost;
};

/** Renders the anonymous API response fetched by the page on the server. */
const PublicBlogPostView = ({ post }: PublicBlogPostViewProps) => {
  return (
    // pt-[calc(70px+2.5rem)] clears the Navbar's fixed positioning — same
    // value ReusableHero uses, since this page has no hero of its own to
    // do that automatically.
    <article className="bg-white pb-16 pt-[calc(70px+2.5rem)] md:pb-20 md:pt-[calc(80px+3.5rem)]">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <Link
          href="/resources/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-700"
        >
          <LuArrowLeft className="size-4" />
          Back to the blog
        </Link>

        <div>
          <h1 className="mt-6 font-montserrat text-3xl font-extrabold tracking-[-0.02em] text-neutral-950 md:text-4xl">
            {post.title}
          </h1>
          {post.published_at && (
            <p className="mt-3 text-sm text-slate-600">
              <AppDate value={post.published_at} format="long" />
            </p>
          )}
        </div>

        {post.cover_image?.public_url && (
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.cover_image.public_url}
              alt=""
              className="mt-8 h-64 w-full rounded-2xl object-cover md:h-96"
            />
          </div>
        )}

        <div>
          <p className="mt-8 whitespace-pre-wrap text-base leading-relaxed text-slate-700">
            {post.content}
          </p>
        </div>
      </div>
    </article>
  );
};

export { PublicBlogPostView };
