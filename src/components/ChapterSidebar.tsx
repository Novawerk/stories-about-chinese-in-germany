'use client';

import { useEffect, useState } from 'react';

type Chapter = { slug: string; title: string };

export function ChapterSidebar({ chapters }: { chapters: Chapter[] }) {
  const [active, setActive] = useState<string | null>(
    chapters[0]?.slug ?? null,
  );

  useEffect(() => {
    if (!chapters.length || typeof window === 'undefined') return;

    const elements = chapters
      .map((c) => document.getElementById(c.slug))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    // Active = the topmost section whose top has crossed (or is close to) the
    // viewport's upper third. This avoids flicker when a section is briefly
    // only partially visible.
    const update = () => {
      const threshold = window.innerHeight * 0.3;
      let current: string | null = null;
      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        if (rect.top - threshold <= 0) {
          current = el.id;
        } else {
          break;
        }
      }
      setActive(current ?? elements[0].id);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [chapters]);

  if (chapters.length <= 1) return null;

  return (
    <nav
      aria-label="章节导航"
      className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2"
    >
      <div className="eyebrow text-ink/40 pb-4 border-b border-ink/10">
        目录 · Contents
      </div>
      <ol className="mt-4 space-y-0.5">
        {chapters.map((ch, i) => {
          const isActive = active === ch.slug;
          return (
            <li key={ch.slug}>
              <a
                href={`#${encodeURIComponent(ch.slug)}`}
                className={`group block py-2 pl-4 border-l-2 text-sm leading-relaxed transition-colors ${
                  isActive
                    ? 'border-accent text-ink'
                    : 'border-ink/10 text-ink/45 hover:text-ink/80 hover:border-ink/30'
                }`}
              >
                <span
                  className={`eyebrow block text-[0.62rem] mb-0.5 ${
                    isActive ? 'text-accent' : 'text-ink/35'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-serif">{ch.title}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
