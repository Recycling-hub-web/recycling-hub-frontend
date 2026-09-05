import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LuArrowRight, LuNewspaper } from 'react-icons/lu';

import { listBlogPosts } from '../../features/blogs/services/blogService';
import type { BlogPost } from '../../features/blogs/types';
import { Button } from '../../ui/buttons/Button';
import { AppDate } from '../../ui/date/AppDate';
import { FadeIn } from '../../ui/FadeIn';

const POST_COUNT = 3;

/** Homepage teaser for the public blog (features/blogs/) — a standalone
 * fetch rather than reusing useBlogPosts, since this only ever wants
 * the latest `POST_COUNT` published posts on page 1, no pagination
 * state. Anonymous GET /blogs/ already only returns published posts
 * (BlogPostViewSet.get_queryset), same guarantee PublicBlogListView
 * relies on. Renders nothing while loading/empty/errored — a homepage
 * section shouldn't show a spinner or error banner for content that's
 * secondary to the page. */
const LatestBlogSection = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    listBlogPosts({ page: 1, page_size: POST_COUNT })
      .then((data) => setPosts(data.results))
      .catch(() => setPosts([]))
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded || posts.length === 0) return null;

  return (
    <section className="bg-neutral-50 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <FadeIn>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-600">
                From the blog
              </p>
              <h2 className="mt-2 font-montserrat text-2xl font-extrabold text-neutral-950 sm:text-3xl">
                Recycling news, guides & updates
              </h2>
            </div>
            <Button href="/resources/blog" variant="secondary">
              Visit the blog <LuArrowRight className="ml-1.5 size-4" />
            </Button>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <FadeIn key={post.id} delay={i * 0.06}>
              <Link
                href={`/resources/blog/${post.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-colors duration-200 hover:border-brand-600"
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
                    {post.excerpt}
                  </p>
                  <p className="mt-5 flex items-center gap-1 text-xs font-semibold text-brand-600">
                    Read more <LuArrowRight className="size-3.5" />
                  </p>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export { LatestBlogSection };
