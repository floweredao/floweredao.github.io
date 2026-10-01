import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).optional(),
  }),
});

const link = z.object({
  label: z.string(),
  href: z.string(),
});

const image = z.object({
  src: z.string(),
  alt: z.string(),
});

const feature = z.object({
  title: z.string(),
  body: z.string(),
});

const galleryItem = image.extend({
  caption: z.string(),
});

const portfolio = defineCollection({
  loader: glob({ base: './src/content/portfolio', pattern: '*.md' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    summary: z.string(),
    audience: z.string(),
    platform: z.string(),
    year: z.coerce.string(),
    order: z.number(),
    visibility: z.enum(['public', 'private']),
    stack: z.array(z.string()),
    links: z.array(link).default([]),
    cover: image,
    features: z.array(feature).default([]),
    gallery: z.array(galleryItem).default([]),
  }),
});

export const collections = { blog, portfolio };
