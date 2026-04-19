import Link from 'next/link';
import { getCollections } from '@/lib/content';
import { site } from '@/lib/site';

const ISSUE_NUMBER = 'VOL. I';
const PUB_LINE = 'BERLIN · DUISBURG · RUHR';

export default async function HomePage() {
  const collections = await getCollections();
  const totalPosts = collections.reduce((n, c) => n + c.postCount, 0);

  return (
    <div className="paper-texture">
      <Masthead totalPosts={totalPosts} collectionCount={collections.length} />
      <CollectionsGrid collections={collections} />
      <ManifestoBand />
    </div>
  );
}

function Masthead({
  totalPosts,
  collectionCount,
}: {
  totalPosts: number;
  collectionCount: number;
}) {
  const today = new Date().toISOString().slice(0, 10);
  return (
    <section className="relative z-10 border-b border-ink pt-10 pb-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between text-[0.7rem] text-ink/70 eyebrow">
          <span>{ISSUE_NUMBER}</span>
          <span>{PUB_LINE}</span>
          <span>{today}</span>
        </div>
        <div className="rule-thick my-5" />
        <h1 className="nameplate text-[clamp(3rem,12vw,9rem)] leading-[0.88]">
          {site.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <p className="font-sans text-sm tracking-[0.3em] text-ink/60 uppercase">
            {site.subtitle}
          </p>
          <p className="text-xs text-ink/50 font-mono">
            {collectionCount} COLLECTIONS · {totalPosts} STORIES
          </p>
        </div>
        <p className="mt-8 max-w-2xl font-serif text-lg leading-relaxed text-ink/80">
          {site.description}
        </p>
      </div>
    </section>
  );
}

function CollectionsGrid({
  collections,
}: {
  collections: Awaited<ReturnType<typeof getCollections>>;
}) {
  return (
    <section className="relative z-10">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="eyebrow text-ink/50">栏目 · Collections</div>
            <h2 className="mt-2 nameplate text-4xl md:text-5xl">这一期的故事</h2>
          </div>
          <Link
            href="/submit"
            className="eyebrow hidden shrink-0 border-b border-ink pb-1 text-ink hover:border-accent hover:text-accent md:inline-block"
          >
            投一篇稿件 →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-6">
          {collections.map((c, i) => (
            <CollectionCard key={c.slug} collection={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CollectionCard({
  collection,
  index,
}: {
  collection: Awaited<ReturnType<typeof getCollections>>[number];
  index: number;
}) {
  // Asymmetric magazine grid: first card takes 8/12, next 4/12, then 6/6, etc.
  const spans = [
    'md:col-span-8 md:row-span-2',
    'md:col-span-4',
    'md:col-span-4',
    'md:col-span-8',
    'md:col-span-6',
    'md:col-span-6',
  ];
  const span = spans[index % spans.length];
  const isLarge = span.includes('col-span-8');

  return (
    <Link
      href={`/${collection.slug}`}
      className={`group relative flex flex-col justify-between overflow-hidden border border-ink/15 bg-paper-warm/60 px-7 py-8 transition-all hover:border-ink hover:bg-paper-warm ${span}`}
    >
      <div>
        <div className="eyebrow text-ink/50">
          No. {String(collection.order).padStart(2, '0')} · {collection.postCount} 篇
        </div>
        <h3
          className={`nameplate mt-4 ${
            isLarge ? 'text-5xl md:text-6xl' : 'text-3xl md:text-4xl'
          }`}
        >
          {collection.title}
        </h3>
        {collection.subtitle && (
          <div className="mt-3 font-serif text-lg text-ink/60 italic">
            {collection.subtitle}
          </div>
        )}
        <p
          className={`mt-6 font-serif text-ink/75 leading-relaxed ${
            isLarge ? 'text-lg' : 'text-base'
          }`}
        >
          {collection.tagline}
        </p>
      </div>
      <div className="mt-8 flex items-center justify-between text-sm">
        <span className="eyebrow text-ink/40">阅读栏目</span>
        <span
          aria-hidden
          className="inline-block text-lg text-accent transition-transform group-hover:translate-x-1"
        >
          →
        </span>
      </div>
    </Link>
  );
}

function ManifestoBand() {
  return (
    <section className="relative z-10 border-y border-ink bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="eyebrow text-paper/60">发刊词 · Editor's Note</div>
        <blockquote className="mt-6 font-serif text-2xl leading-relaxed md:text-3xl md:leading-[1.5]">
          "我们从世界中拿走的欢乐，如同一把被重重砸在地上的吉他，在一刻宣泄的嘈杂过后，
          <br className="hidden md:inline" />
          留下了难以平复的一地狼藉。"
        </blockquote>
        <div className="mt-6 eyebrow text-paper/60">—— 《引子》</div>
      </div>
    </section>
  );
}
