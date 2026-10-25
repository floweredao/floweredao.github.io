export const escapeXml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

export const xmlResponse = (body: string, type = 'application/xml'): Response =>
  new Response(`<?xml version="1.0" encoding="UTF-8"?>\n${body}\n`, { headers: { 'Content-Type': `${type}; charset=utf-8` } });
