import type { APIRoute } from 'astro';
import { xmlResponse } from '../lib/xml';

export const GET: APIRoute = ({ site }) =>
  xmlResponse(
    [
      '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      `  <sitemap><loc>${new URL('/sitemap-0.xml', site).href}</loc></sitemap>`,
      '</sitemapindex>',
    ].join('\n'),
  );
