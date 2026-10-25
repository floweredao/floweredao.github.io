import type { APIRoute } from 'astro';
import { getPosts, postHref, SITE_NAME } from '../lib/content';
import { escapeXml, xmlResponse } from '../lib/xml';

// 공개 글(draft 제외) 목록을 RSS 2.0으로 내보냅니다. 외부 의존성 없이 직접 만듭니다.
export const GET: APIRoute = async ({ site }) => {
  const posts = await getPosts();
  const home = new URL('/', site).href;
  const items = posts
    .map((post) => {
      const url = new URL(postHref(post.id), site).href;
      return [
        '    <item>',
        `      <title>${escapeXml(post.data.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <description>${escapeXml(post.data.description)}</description>`,
        `      <pubDate>${post.data.date.toUTCString()}</pubDate>`,
        ...(post.data.tags ?? []).map((tag) => `      <category>${escapeXml(tag)}</category>`),
        '    </item>',
      ].join('\n');
    })
    .join('\n');
  return xmlResponse(
    [
      '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
      '  <channel>',
      `    <title>${SITE_NAME} 블로그</title>`,
      `    <link>${home}blog/</link>`,
      `    <description>${SITE_NAME}가 쓴 글</description>`,
      '    <language>ko</language>',
      `    <atom:link href="${new URL('/rss.xml', site).href}" rel="self" type="application/rss+xml" />`,
      items,
      '  </channel>',
      '</rss>',
    ]
      .filter(Boolean)
      .join('\n'),
    'application/rss+xml',
  );
};
