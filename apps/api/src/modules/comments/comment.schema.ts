import { z } from 'zod';

export const createCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'Comment cannot be empty')
    .max(5000, 'Comment is too long'),
});

export const updateCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'Comment cannot be empty')
    .max(5000, 'Comment is too long'),
});

export const listCommentsQuerySchema = z.object({
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(20),
});

export type CreateCommentInput =
  z.infer<typeof createCommentSchema>;

export type UpdateCommentInput =
  z.infer<typeof updateCommentSchema>;

export type ListCommentsQuery =
  z.infer<typeof listCommentsQuerySchema>;