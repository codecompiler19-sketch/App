import { defineCollection, z } from 'astro:content';

const tutorialsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    category: z.enum(['html', 'css', 'javascript']),
    order: z.number(),
  }),
});

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    category: z.enum(['HTML & CSS', 'JavaScript', 'HTML CSS JavaScript']),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
    featured: z.boolean().optional().default(false),
    author: z.string().optional().default('CodesCompiler'),
    seoTitle: z.string().optional(),
  }),
});

export const collections = {
  'tutorials': tutorialsCollection,
  'blog': blogCollection,
};
