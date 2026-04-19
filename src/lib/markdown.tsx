import React from 'react';

/**
 * Ultra-small server-side Markdown renderer sufficient for this site's prose:
 * paragraphs, headings, horizontal rules, block quotes, emphasis / strong,
 * inline links, and inline code. No HTML passthrough, no raw HTML. Images
 * use `![alt](src)`.
 *
 * Rationale: the posts here are plain Chinese prose — we don't need the full
 * weight of MDX + remark/rehype. Keeping this in-house makes the post page a
 * server component with zero extra runtime, and keeps Chinese typography
 * rules (paragraph indent, drop cap) entirely in CSS.
 */

type Block =
  | { type: 'h'; level: 2 | 3 | 4; text: string }
  | { type: 'p'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'hr' }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] };

function parseBlocks(md: string): Block[] {
  const lines = md.replace(/\r\n?/g, '\n').split('\n');
  const blocks: Block[] = [];
  let buffer: string[] = [];
  let mode: 'p' | 'quote' | 'ul' | 'ol' | null = null;

  function flush() {
    if (!buffer.length) {
      mode = null;
      return;
    }
    if (mode === 'p') {
      blocks.push({ type: 'p', text: buffer.join(' ').trim() });
    } else if (mode === 'quote') {
      blocks.push({ type: 'quote', text: buffer.join(' ').trim() });
    } else if (mode === 'ul') {
      blocks.push({ type: 'ul', items: buffer.slice() });
    } else if (mode === 'ol') {
      blocks.push({ type: 'ol', items: buffer.slice() });
    }
    buffer = [];
    mode = null;
  }

  for (const raw of lines) {
    const line = raw;
    const trimmed = line.trim();

    if (trimmed === '') {
      flush();
      continue;
    }

    const h = /^(#{2,4})\s+(.*)$/.exec(trimmed);
    if (h) {
      flush();
      blocks.push({
        type: 'h',
        level: h[1].length as 2 | 3 | 4,
        text: h[2].trim(),
      });
      continue;
    }

    if (/^(-{3,}|\*{3,})$/.test(trimmed)) {
      flush();
      blocks.push({ type: 'hr' });
      continue;
    }

    const quote = /^>\s?(.*)$/.exec(trimmed);
    if (quote) {
      if (mode !== 'quote') flush();
      mode = 'quote';
      buffer.push(quote[1]);
      continue;
    }

    const ul = /^[-*+]\s+(.+)$/.exec(trimmed);
    if (ul) {
      if (mode !== 'ul') flush();
      mode = 'ul';
      buffer.push(ul[1]);
      continue;
    }

    const ol = /^\d+\.\s+(.+)$/.exec(trimmed);
    if (ol) {
      if (mode !== 'ol') flush();
      mode = 'ol';
      buffer.push(ol[1]);
      continue;
    }

    if (mode !== 'p') flush();
    mode = 'p';
    buffer.push(trimmed);
  }
  flush();
  return blocks;
}

function renderInline(text: string): React.ReactNode {
  // Handle: links, **strong**, *em*, `code`.
  // Tokenize with regex groups, then walk.
  const tokens: React.ReactNode[] = [];
  const re =
    /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) tokens.push(text.slice(last, match.index));
    if (match[1] && match[2]) {
      const href = match[2];
      const external = /^https?:\/\//.test(href);
      tokens.push(
        <a
          key={`l-${key++}`}
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noreferrer' : undefined}
          className="underline decoration-accent/60 underline-offset-2 hover:text-accent hover:decoration-accent"
        >
          {match[1]}
        </a>,
      );
    } else if (match[3]) {
      tokens.push(
        <strong key={`b-${key++}`} className="font-semibold">
          {match[3]}
        </strong>,
      );
    } else if (match[4]) {
      tokens.push(
        <em key={`i-${key++}`} className="italic">
          {match[4]}
        </em>,
      );
    } else if (match[5]) {
      tokens.push(
        <code
          key={`c-${key++}`}
          className="rounded bg-paper-warm px-1.5 py-0.5 font-mono text-[0.9em]"
        >
          {match[5]}
        </code>,
      );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) tokens.push(text.slice(last));
  return tokens;
}

export function Markdown({ children }: { children: string }) {
  const blocks = parseBlocks(children);
  return (
    <div className="article-body">
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'h': {
            const Tag = (`h${b.level}` as unknown) as keyof React.JSX.IntrinsicElements;
            const sizes = {
              2: 'mt-16 mb-4 text-3xl md:text-4xl',
              3: 'mt-12 mb-3 text-2xl md:text-3xl',
              4: 'mt-10 mb-2 text-xl md:text-2xl',
            } as const;
            return (
              <Tag
                key={i}
                className={`nameplate font-bold text-ink ${sizes[b.level]}`}
              >
                {renderInline(b.text)}
              </Tag>
            );
          }
          case 'p':
            return (
              <p
                key={i}
                className="my-4 font-serif text-[1.125rem] leading-[1.95] text-ink/85 indent-[2em] first:mt-0"
              >
                {renderInline(b.text)}
              </p>
            );
          case 'quote':
            return (
              <blockquote
                key={i}
                className="my-8 border-l-2 border-accent pl-5 font-serif text-lg italic text-ink/70"
              >
                {renderInline(b.text)}
              </blockquote>
            );
          case 'hr':
            return <div key={i} className="ornament" aria-hidden />;
          case 'ul':
            return (
              <ul key={i} className="my-6 list-disc space-y-2 pl-6 font-serif text-ink/85">
                {b.items.map((item, j) => (
                  <li key={j}>{renderInline(item)}</li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={i} className="my-6 list-decimal space-y-2 pl-6 font-serif text-ink/85">
                {b.items.map((item, j) => (
                  <li key={j}>{renderInline(item)}</li>
                ))}
              </ol>
            );
        }
      })}
    </div>
  );
}
