#!/usr/bin/env node
/**
 * Sync handwritten Markdown from `articles/🇩🇪...` folders into `content/`
 * where the Next.js site expects it.
 *
 * Runs automatically before `next dev` and `next build` (see package.json).
 *
 * Conventions for source folders:
 *   - Any directory under `articles/` whose name starts with 🇩🇪 is treated
 *     as a collection. Add more by creating a new folder — no code changes
 *     needed.
 *   - Inside a collection, every `.md` file (recursively — `正文/` too) becomes
 *     one post. Files named `完整故事.md` and `修改意见.md` are skipped
 *     (former is auto-generated; latter is AI editor notes).
 *   - Optional `meta.json` in a collection overrides slug / title / description
 *     / order / tagline. See existing examples below.
 *   - Optional frontmatter in a post .md file overrides its title / order /
 *     excerpt. Without frontmatter the script derives title from the first
 *     `#` heading or the filename, and order from any leading `N-` prefix.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const ARTICLES = path.join(ROOT, 'articles');
const OUT = path.join(ROOT, 'content');

const SKIP_FILES = new Set(['完整故事.md', '修改意见.md']);

const DEFAULT_COLLECTION_META = {
  // folder name → { slug, title, tagline, order }
  '🇩🇪创业往事-我开软件公司的七年': {
    slug: 'entrepreneur',
    title: '创业往事',
    subtitle: '我开软件公司的七年',
    tagline:
      '在德国创业七年的心路历程。从 1000 块一个的私活开始，到在鲁尔河畔立下"十年上市"的豪言壮语。',
    order: 1,
  },
  '🇩🇪小厂打工人不定期汇报': {
    slug: 'small-company',
    title: '小厂打工人',
    subtitle: '不定期汇报',
    tagline: '在德国中小型企业工作的日常与观察。',
    order: 2,
  },
  '🇩🇪再启程前的故事 - 在德国公司做管理': {
    slug: 'management',
    title: '再启程前的故事',
    subtitle: '在德国公司做管理',
    tagline: '一段在德国公司做管理的经历，写在下一次出发之前。',
    order: 3,
  },
};

function toSlug(name) {
  // Remove extension + leading numeric prefix (`3-标题` → `标题`), lowercase,
  // replace non-word chars with hyphens. Keep CJK untouched so the slug is
  // still meaningful even if we fall through.
  return name
    .replace(/\.md$/i, '')
    .replace(/^\d+[\-_.\s]+/, '')
    .replace(/\s+/g, '-')
    .replace(/[\/\\?#]/g, '-')
    .toLowerCase();
}

function orderFromFilename(name) {
  const m = /^(\d+)/.exec(name);
  return m ? parseInt(m[1], 10) : 999;
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(full);
    }
  }
  return files;
}

async function loadCollectionMeta(dir, folderName) {
  const metaPath = path.join(dir, 'meta.json');
  let meta = {};
  try {
    const raw = await fs.readFile(metaPath, 'utf8');
    meta = JSON.parse(raw);
  } catch {
    /* no meta.json → use defaults */
  }
  const defaults = DEFAULT_COLLECTION_META[folderName] ?? {};
  const slug = meta.slug || defaults.slug || toSlug(folderName.replace(/^🇩🇪/, ''));
  const title = meta.title || defaults.title || folderName.replace(/^🇩🇪/, '').trim();
  return {
    slug,
    title,
    subtitle: meta.subtitle ?? defaults.subtitle ?? '',
    tagline: meta.tagline ?? defaults.tagline ?? '',
    order: meta.order ?? defaults.order ?? 999,
    sourceFolder: folderName,
  };
}

function titleFromFilename(name) {
  // `0-引子.md` → `引子`, `2-我要给你建座大楼.md` → `我要给你建座大楼`
  return name.replace(/\.md$/i, '').replace(/^\d+[\-_.\s]+/, '');
}

function isTitleLine(line) {
  const t = line.trim();
  // `# 标题` or `## 标题` (markdown heading) OR `N/标题` (this repo's convention
  // from merge_chapters.py — first line is `章节序号/标题`)
  return /^#+\s+\S/.test(t) || /^\d+\s*\/\s*\S/.test(t);
}

function extractTitleLine(line) {
  const t = line.trim();
  const h = /^#+\s+(.+)$/.exec(t);
  if (h) return h[1].trim();
  const slash = /^\d+\s*\/\s*(.+)$/.exec(t);
  if (slash) return slash[1].trim();
  return t;
}

function stripTitleLine(raw) {
  // If the first non-empty line is a title (heading or `N/标题`), remove it
  // from the body so it doesn't render twice.
  const lines = raw.split('\n');
  let i = 0;
  while (i < lines.length && lines[i].trim() === '') i++;
  if (i < lines.length && isTitleLine(lines[i])) {
    lines.splice(i, 1);
    while (i < lines.length && lines[i].trim() === '') lines.splice(i, 1);
  }
  return lines.join('\n');
}

function deriveTitleFromContent(raw) {
  const lines = raw.split('\n');
  for (const line of lines) {
    if (line.trim() === '') continue;
    if (isTitleLine(line)) return extractTitleLine(line);
    return null;
  }
  return null;
}

function deriveExcerpt(raw, maxLen = 90) {
  const stripped = raw
    .replace(/^---[\s\S]*?---/, '')
    .replace(/^#.*$/gm, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[>*_`]/g, '')
    .trim();
  const firstPara = stripped.split(/\n\s*\n/).find((p) => p.trim().length > 0) ?? '';
  const oneLine = firstPara.replace(/\s+/g, '').trim();
  if (oneLine.length <= maxLen) return oneLine;
  return oneLine.slice(0, maxLen) + '…';
}

async function processCollection(absDir, folderName) {
  const meta = await loadCollectionMeta(absDir, folderName);
  const allMd = await walk(absDir);
  const posts = [];

  for (const absPath of allMd) {
    const rel = path.relative(absDir, absPath);
    const base = path.basename(absPath);
    if (SKIP_FILES.has(base)) continue;

    const raw = await fs.readFile(absPath, 'utf8');
    const parsed = matter(raw);
    const fm = parsed.data || {};

    const filenameTitle = titleFromFilename(base);
    const slug = fm.slug || toSlug(base);
    const title =
      fm.title || deriveTitleFromContent(parsed.content) || filenameTitle;
    const order = fm.order ?? orderFromFilename(base);
    const body = stripTitleLine(parsed.content);
    const excerpt = fm.excerpt || deriveExcerpt(body);

    posts.push({
      slug,
      title,
      order,
      excerpt,
      sourcePath: path.join('articles', folderName, rel),
      raw: body,
      frontmatter: fm,
    });
  }

  posts.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'zh'));
  return { meta, posts };
}

async function main() {
  await fs.rm(OUT, { recursive: true, force: true });
  await fs.mkdir(OUT, { recursive: true });

  const entries = await fs.readdir(ARTICLES, { withFileTypes: true });
  const collectionDirs = entries
    .filter((e) => e.isDirectory() && e.name.startsWith('🇩🇪'))
    .map((e) => e.name)
    .sort();

  const collections = [];
  const slugSeen = new Set();

  for (const folderName of collectionDirs) {
    const absDir = path.join(ARTICLES, folderName);
    const { meta, posts } = await processCollection(absDir, folderName);

    if (slugSeen.has(meta.slug)) {
      throw new Error(
        `Duplicate collection slug "${meta.slug}" (folder: ${folderName}). ` +
          `Set a unique "slug" in ${folderName}/meta.json.`,
      );
    }
    slugSeen.add(meta.slug);

    const collDir = path.join(OUT, meta.slug);
    await fs.mkdir(collDir, { recursive: true });

    const postIndex = [];
    const postSlugSeen = new Set();
    for (const post of posts) {
      if (postSlugSeen.has(post.slug)) {
        throw new Error(
          `Duplicate post slug "${post.slug}" in collection "${meta.slug}" ` +
            `(source: ${post.sourcePath}). Rename the file or set \`slug:\` in frontmatter.`,
        );
      }
      postSlugSeen.add(post.slug);

      // Write the MD file stripped of frontmatter so the renderer sees pure body.
      const outPath = path.join(collDir, `${post.slug}.md`);
      await fs.writeFile(outPath, post.raw, 'utf8');

      postIndex.push({
        slug: post.slug,
        title: post.title,
        order: post.order,
        excerpt: post.excerpt,
        sourcePath: post.sourcePath,
      });
    }

    await fs.writeFile(
      path.join(collDir, 'index.json'),
      JSON.stringify({ ...meta, posts: postIndex }, null, 2),
      'utf8',
    );

    collections.push({ ...meta, postCount: postIndex.length });
  }

  collections.sort((a, b) => a.order - b.order);
  await fs.writeFile(
    path.join(OUT, 'collections.json'),
    JSON.stringify({ collections }, null, 2),
    'utf8',
  );

  const total = collections.reduce((n, c) => n + c.postCount, 0);
  console.log(
    `[sync-content] ${collections.length} collection(s), ${total} post(s) → content/`,
  );
}

main().catch((err) => {
  console.error('[sync-content] failed:', err);
  process.exit(1);
});
