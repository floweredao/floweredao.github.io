import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;
export type Work = CollectionEntry<'portfolio'>;

export const SITE_NAME = 'floweredao';

export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => (import.meta.env.PROD ? !data.draft : true));
  return posts.sort(
    (a, b) =>
      b.data.date.valueOf() - a.data.date.valueOf() || a.data.title.localeCompare(b.data.title, 'ko'),
  );
}

export async function getWorks(): Promise<Work[]> {
  const works = await getCollection('portfolio');
  return works.sort(
    (a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title, 'ko'),
  );
}

export const postHref = (id: string): string => `/blog/${id}/`;

export const tagHref = (tag: string): string => `/blog/tags/${encodeURIComponent(tag)}/`;

/** 공개 글의 태그를 글 수와 함께, 글이 많은 순(같으면 이름순)으로 돌려줍니다. */
export function countTags(posts: Post[]): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of posts) for (const tag of post.data.tags ?? []) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  return [...counts]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'ko'));
}

export const workHref = (id: string): string => `/portfolio/${id}/`;

const koreanDate = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});

export const formatDate = (date: Date): string => koreanDate.format(date);

export const isoDate = (date: Date): string => date.toISOString().slice(0, 10);
