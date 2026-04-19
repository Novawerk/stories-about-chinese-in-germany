import { promises as fs } from 'node:fs';
import path from 'node:path';

const CONTENT_ROOT = path.join(process.cwd(), 'content');

export type PostSummary = {
  slug: string;
  title: string;
  order: number;
  excerpt: string;
  sourcePath: string;
};

export type CollectionIndex = {
  slug: string;
  title: string;
  subtitle: string;
  tagline: string;
  order: number;
  sourceFolder: string;
  posts: PostSummary[];
};

export type CollectionSummary = Omit<CollectionIndex, 'posts'> & {
  postCount: number;
};

export async function getCollections(): Promise<CollectionSummary[]> {
  const raw = await fs.readFile(
    path.join(CONTENT_ROOT, 'collections.json'),
    'utf8',
  );
  const parsed = JSON.parse(raw) as { collections: CollectionSummary[] };
  return parsed.collections;
}

export async function getCollection(
  slug: string,
): Promise<CollectionIndex | null> {
  try {
    const raw = await fs.readFile(
      path.join(CONTENT_ROOT, slug, 'index.json'),
      'utf8',
    );
    return JSON.parse(raw) as CollectionIndex;
  } catch {
    return null;
  }
}

export async function getPostBody(
  collectionSlug: string,
  postSlug: string,
): Promise<string | null> {
  try {
    return await fs.readFile(
      path.join(CONTENT_ROOT, collectionSlug, `${postSlug}.md`),
      'utf8',
    );
  } catch {
    return null;
  }
}

export async function getAllPostPaths(): Promise<
  Array<{ collection: string; slug: string }>
> {
  const collections = await getCollections();
  const out: Array<{ collection: string; slug: string }> = [];
  for (const c of collections) {
    const full = await getCollection(c.slug);
    if (!full) continue;
    for (const p of full.posts) {
      out.push({ collection: c.slug, slug: p.slug });
    }
  }
  return out;
}

export function findAdjacentPosts(
  posts: PostSummary[],
  currentSlug: string,
): { prev: PostSummary | null; next: PostSummary | null } {
  const idx = posts.findIndex((p) => p.slug === currentSlug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? posts[idx - 1] : null,
    next: idx < posts.length - 1 ? posts[idx + 1] : null,
  };
}
