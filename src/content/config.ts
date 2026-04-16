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

export const collections = {
  'tutorials': tutorialsCollection,
};
