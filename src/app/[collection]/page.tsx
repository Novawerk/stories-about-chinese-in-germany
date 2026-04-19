import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCollection, getCollections } from '@/lib/content';

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

  return (
    <article className="paper-texture">
      <header className="relative z-10 border-b border-ink pt-12 pb-10">
        <div className="mx-auto max-w-5xl px-6">
          <Link href="/" className="eyebrow text-ink/50 hover:text-accent">
            ← 回到首页
          </Link>
          <div className="mt-8 eyebrow text-ink/50">
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
          <div className="mt-8 eyebrow text-ink/40">
            共 {c.posts.length} 篇
          </div>
        </div>
      </header>

      <section className="relative z-10">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <ul className="divide-y divide-ink/15 border-y border-ink/15">
            {c.posts.map((p, i) => (
              <li key={p.slug}>
                <Link
                  href={`/${c.slug}/${encodeURIComponent(p.slug)}`}
                  className="group grid grid-cols-[auto_1fr_auto] gap-6 py-8 transition-colors hover:bg-paper-warm/70 -mx-6 px-6"
                >
                  <div className="eyebrow w-12 shrink-0 pt-2 text-ink/40">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="min-w-0">
                    <h2 className="nameplate text-2xl md:text-3xl group-hover:text-accent transition-colors">
                      {p.title}
                    </h2>
                    <p className="mt-3 font-serif text-base leading-relaxed text-ink/70 line-clamp-2">
                      {p.excerpt}
                    </p>
                  </div>
                  <div
                    aria-hidden
                    className="self-center text-2xl text-ink/30 transition-all group-hover:text-accent group-hover:translate-x-1"
                  >
                    →
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  );
}
