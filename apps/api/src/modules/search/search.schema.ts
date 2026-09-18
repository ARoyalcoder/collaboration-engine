import { z } from 'zod';

export const searchSchema = z.object({
  q: z
    .string()
    .trim()
    .min(2, 'Search query must be at least 2 characters')
    .max(100, 'Search query is too long'),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(50)
    .default(20),
});

export type SearchInput =
  z.infer<typeof searchSchema>;