import type { APIRoute } from 'astro';
import { getPosts, getWorks, isoDate, postHref, workHref } from '../lib/content';
import { escapeXml, xmlResponse } from '../lib/xml';

// 공개 페이지 목록. /admin/은 noindex라 넣지 않습니다.
export const GET: APIRoute = async ({ site }) => {
  const posts = await getPosts();
  const works = await getWorks();
  const entries: { path: string; lastmod?: string }[] = [
    { path: '/' },
    { path: '/blog/' },
    ...posts.map((post) => ({ path: postHref(post.id), lastmod: isoDate(post.data.date) })),
    { path: '/portfolio/' },
    ...works.map((work) => ({ path: workHref(work.id) })),
  ];
  const urls = entries
    .map(({ path, lastmod }) => {
      const loc = `    <loc>${escapeXml(new URL(path, site).href)}</loc>`;
      return ['  <url>', loc, ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []), '  </url>'].join('\n');
    })
    .join('\n');
  return xmlResponse(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`);
};
