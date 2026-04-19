import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="paper-texture">
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <div className="eyebrow text-ink/50">404</div>
        <h1 className="mt-6 nameplate text-7xl md:text-9xl">走丢了。</h1>
        <p className="mt-8 font-serif text-lg text-ink/70">
          这条小路没有通向任何一篇稿件。
        </p>
        <Link
          href="/"
          className="mt-10 inline-block eyebrow border-b border-ink pb-1 text-ink hover:border-accent hover:text-accent"
        >
          回到首页 →
        </Link>
      </div>
    </div>
  );
}
