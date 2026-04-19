import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: `${site.title} · ${site.subtitle}`,
    template: `%s · ${site.title}`,
  },
  description: site.description,
  metadataBase: new URL(`https://${site.domain}`),
  openGraph: {
    title: site.title,
    description: site.description,
    url: `https://${site.domain}`,
    siteName: site.title,
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: site.title,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: '#fdfcf8',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hans">
      <body className="min-h-screen bg-paper text-ink antialiased">
        <SiteHeader />
        <main className="relative z-10">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-paper/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="nameplate text-lg tracking-tight text-ink hover:text-accent transition-colors"
        >
          {site.title}
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/submit"
            className="eyebrow text-ink/70 hover:text-accent transition-colors"
          >
            投稿
          </Link>
          <a
            href={site.repo}
            target="_blank"
            rel="noreferrer"
            className="eyebrow text-ink/70 hover:text-accent transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-ink/10">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="nameplate text-2xl">{site.title}</div>
            <div className="mt-2 text-sm text-ink/60">{site.subtitle}</div>
          </div>
          <div className="text-xs text-ink/50 md:text-right">
            <div>
              内容采用{' '}
              <a
                href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh"
                className="underline decoration-ink/30 hover:text-accent hover:decoration-accent"
                target="_blank"
                rel="noreferrer"
              >
                {site.license}
              </a>{' '}
              许可
            </div>
            <div className="mt-1">
              <a
                href={site.repo}
                className="underline decoration-ink/30 hover:text-accent hover:decoration-accent"
                target="_blank"
                rel="noreferrer"
              >
                在 GitHub 上查看源稿
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
