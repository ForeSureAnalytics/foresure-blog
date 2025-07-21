import { z, defineCollection } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    pubDate: z.string(),
    description: z.string().optional(),
  })
});

export const collections = { blog };
