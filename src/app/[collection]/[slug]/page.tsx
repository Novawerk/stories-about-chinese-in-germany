import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import readingTime from 'reading-time';
import {
  findAdjacentPosts,
  getAllPostPaths,
  getCollection,
  getPostBody,
} from '@/lib/content';
import { githubEditUrl, site } from '@/lib/site';
import { Markdown } from '@/lib/markdown';
import { ReadingProgress } from '@/components/ReadingProgress';

export async function generateStaticParams() {
  const paths = await getAllPostPaths();
  return paths.map((p) => ({ collection: p.collection, slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ collection: string; slug: string }>;
}): Promise<Metadata> {
  const { collection, slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const c = await getCollection(collection);
  const post = c?.posts.find((p) => p.slug === decodedSlug);
  if (!c || !post) return {};
  return {
    title: `${post.title} · ${c.title}`,
    description: post.excerpt,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ collection: string; slug: string }>;
}) {
  const { collection, slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const c = await getCollection(collection);
  if (!c) notFound();
  const post = c.posts.find((p) => p.slug === decodedSlug);
  if (!post) notFound();
  const body = await getPostBody(collection, decodedSlug);
  if (body === null) notFound();

  const stats = readingTime(body, { wordsPerMinute: 300 });
  const minutes = Math.max(1, Math.round(stats.minutes));
  const { prev, next } = findAdjacentPosts(c.posts, decodedSlug);

  return (
    <>
      <ReadingProgress />
      <article className="paper-texture">
        <header className="relative z-10 border-b border-ink/15 pt-14 pb-10">
          <div className="mx-auto max-w-3xl px-6">
            <Link
              href={`/${c.slug}`}
              className="eyebrow text-ink/50 hover:text-accent"
            >
              ← {c.title}
            </Link>
            <div className="mt-8 eyebrow text-ink/50">
              {c.title} · 第 {String((c.posts.findIndex((p) => p.slug === decodedSlug) + 1)).padStart(2, '0')} 篇
            </div>
            <h1 className="mt-5 nameplate text-[clamp(2rem,6vw,4rem)] leading-[1.05]">
              {post.title}
            </h1>
            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink/50 font-mono">
              <span>约 {minutes} 分钟阅读</span>
              <span aria-hidden>·</span>
              <span>{stats.words} 字</span>
              <span aria-hidden>·</span>
              <a
                href={githubEditUrl(post.sourcePath)}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-ink/30 hover:text-accent hover:decoration-accent"
              >
                在 GitHub 上编辑此篇
              </a>
            </div>
          </div>
        </header>

        <section className="relative z-10">
          <div className="mx-auto max-w-reading px-6 py-16">
            <Markdown>{body}</Markdown>
          </div>
        </section>

        <nav className="relative z-10 border-t border-ink/15">
          <div className="mx-auto max-w-3xl px-6 py-12">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {prev ? (
                <Link
                  href={`/${c.slug}/${encodeURIComponent(prev.slug)}`}
                  className="group block border border-ink/15 p-6 transition-colors hover:border-ink hover:bg-paper-warm/60"
                >
                  <div className="eyebrow text-ink/40">← 上一篇</div>
                  <div className="mt-3 nameplate text-xl group-hover:text-accent">
                    {prev.title}
                  </div>
                </Link>
              ) : (
                <div />
              )}
              {next ? (
                <Link
                  href={`/${c.slug}/${encodeURIComponent(next.slug)}`}
                  className="group block border border-ink/15 p-6 text-right transition-colors hover:border-ink hover:bg-paper-warm/60"
                >
                  <div className="eyebrow text-ink/40">下一篇 →</div>
                  <div className="mt-3 nameplate text-xl group-hover:text-accent">
                    {next.title}
                  </div>
                </Link>
              ) : (
                <div />
              )}
            </div>

            <div className="mt-10 border-t border-ink/10 pt-8 text-center">
              <div className="eyebrow text-ink/40">也想讲讲你的故事？</div>
              <Link
                href="/submit"
                className="nameplate mt-3 inline-block border-b border-ink pb-1 text-lg text-ink hover:border-accent hover:text-accent"
              >
                提交一篇稿件 →
              </Link>
              <p className="mt-4 text-xs text-ink/40">
                内容采用 {site.license} 许可
              </p>
            </div>
          </div>
        </nav>
      </article>
    </>
  );
}
