import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getCollection,
  getCollections,
  getPostBody,
  type PostSummary,
} from '@/lib/content';
import { githubEditUrl, site } from '@/lib/site';
import { Markdown } from '@/lib/markdown';
import { ReadingProgress } from '@/components/ReadingProgress';
import { ChapterSidebar } from '@/components/ChapterSidebar';

type ChapterWithBody = PostSummary & { body: string };

export async function generateStaticParams() {
  const collections = await getCollections();
  return collections.map((c) => ({ collection: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const { collection } = await params;
  const c = await getCollection(collection);
  if (!c) return {};
  return {
    title: c.title,
    description: c.tagline,
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection } = await params;
  const c = await getCollection(collection);
  if (!c) notFound();

  const chapters: ChapterWithBody[] = await Promise.all(
    c.posts.map(async (p) => ({
      ...p,
      body: (await getPostBody(collection, p.slug)) ?? '',
    })),
  );

  const totalChars = chapters.reduce(
    (n, ch) => n + ch.body.replace(/\s/g, '').length,
    0,
  );
  const minutes = Math.max(1, Math.round(totalChars / 400));

  return (
    <>
      <ReadingProgress />
      <article className="paper-texture">
        <Hero
          c={c}
          totalChars={totalChars}
          minutes={minutes}
        />
        <MobileTableOfContents chapters={chapters} />
        <div className="relative z-10">
          <div className="mx-auto max-w-6xl px-6 pb-20">
            <div className="lg:grid lg:grid-cols-[13rem_1fr] lg:gap-12">
              <aside className="hidden lg:block">
                <ChapterSidebar chapters={chapters} />
              </aside>
              <main className="lg:max-w-reading">
                {chapters.map((ch, i) => (
                  <ChapterBlock
                    key={ch.slug}
                    index={i + 1}
                    total={chapters.length}
                    chapter={ch}
                  />
                ))}
              </main>
            </div>
          </div>
        </div>
        <EndOfCollection c={c} />
      </article>
    </>
  );
}

function Hero({
  c,
  totalChars,
  minutes,
}: {
  c: NonNullable<Awaited<ReturnType<typeof getCollection>>>;
  totalChars: number;
  minutes: number;
}) {
  return (
    <header className="relative z-10 border-b border-ink pt-12 pb-10">
      <div className="mx-auto max-w-5xl px-6">
        <Link href="/" className="eyebrow text-ink/50 hover:text-accent">
          ← 回到首页
        </Link>
        <div className="mt-10 eyebrow text-ink/50">
          COLLECTION · No. {String(c.order).padStart(2, '0')}
        </div>
        <h1 className="mt-4 nameplate text-[clamp(2.5rem,9vw,6rem)] leading-[0.95]">
          {c.title}
        </h1>
        {c.subtitle && (
          <div className="mt-4 font-serif text-2xl italic text-ink/60">
            {c.subtitle}
          </div>
        )}
        <p className="mt-8 max-w-2xl font-serif text-lg leading-relaxed text-ink/80">
          {c.tagline}
        </p>
        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-xs text-ink/50 font-mono">
          <span>{c.posts.length} 篇</span>
          <span aria-hidden>·</span>
          <span>{totalChars.toLocaleString('zh-Hans')} 字</span>
          <span aria-hidden>·</span>
          <span>约 {minutes} 分钟通读</span>
        </div>
      </div>
    </header>
  );
}

function MobileTableOfContents({
  chapters,
}: {
  chapters: ChapterWithBody[];
}) {
  if (chapters.length <= 1) return null;
  return (
    <nav
      aria-label="目录"
      className="relative z-10 border-b border-ink/10 bg-paper-warm/40 lg:hidden"
    >
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="eyebrow text-ink/50">目录 · Contents</div>
        <ol className="mt-6 grid grid-cols-1 gap-x-10 gap-y-3 md:grid-cols-2">
          {chapters.map((ch, i) => (
            <li key={ch.slug}>
              <a
                href={`#${encodeURIComponent(ch.slug)}`}
                className="group grid grid-cols-[auto_1fr] items-baseline gap-4 py-1"
              >
                <span className="eyebrow text-ink/40 group-hover:text-accent transition-colors">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-serif text-lg text-ink/85 group-hover:text-accent transition-colors">
                  {ch.title}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}

function ChapterBlock({
  index,
  total,
  chapter,
}: {
  index: number;
  total: number;
  chapter: ChapterWithBody;
}) {
  const isFirst = index === 1;
  const isLast = index === total;
  return (
    <section
      id={chapter.slug}
      className="scroll-mt-20 pt-14 first:pt-12"
    >
      <div className="eyebrow text-ink/40">
        第 {String(index).padStart(2, '0')} 章 · {index} / {total}
      </div>
      <h2 className="mt-3 nameplate text-[clamp(2rem,5vw,3.25rem)] leading-[1.1]">
        {chapter.title}
      </h2>
      <div className="mt-3 flex items-center gap-3 text-xs text-ink/40 font-mono">
        <a
          href={githubEditUrl(chapter.sourcePath)}
          target="_blank"
          rel="noreferrer"
          className="underline decoration-ink/20 hover:text-accent hover:decoration-accent"
        >
          在 GitHub 上编辑
        </a>
        <span aria-hidden>·</span>
        <a
          href={`#${encodeURIComponent(chapter.slug)}`}
          className="underline decoration-ink/20 hover:text-accent hover:decoration-accent"
        >
          复制锚点链接
        </a>
      </div>
      <div className="mt-10">
        <Markdown>{chapter.body}</Markdown>
      </div>
      {!isLast && <div className="ornament" aria-hidden />}
      {isLast && <div className="mt-24" aria-hidden />}
      {isFirst && null}
    </section>
  );
}

function EndOfCollection({
  c,
}: {
  c: NonNullable<Awaited<ReturnType<typeof getCollection>>>;
}) {
  return (
    <section className="relative z-10 border-t border-ink/15">
      <div className="mx-auto max-w-reading px-6 py-20 text-center">
        <div className="eyebrow text-ink/40">栏目完 · End of Collection</div>
        <h2 className="mt-6 nameplate text-4xl md:text-5xl">
          故事读完了。
        </h2>
        <p className="mt-8 font-serif text-lg leading-relaxed text-ink/70">
          如果你也有一段想讲的故事，
          <br />
          这本集子永远在等你。
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
          <Link
            href="/submit"
            className="eyebrow inline-block border-b border-ink pb-1 text-ink hover:border-accent hover:text-accent"
          >
            投一篇稿件 →
          </Link>
          <Link
            href="/"
            className="eyebrow inline-block text-ink/50 hover:text-accent"
          >
            返回首页
          </Link>
        </div>
        <p className="mt-16 text-xs text-ink/40">
          《{c.title}》 · 内容采用 {site.license} 许可
        </p>
      </div>
    </section>
  );
}
