import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Task title must be at least 2 characters')
    .max(200, 'Task title must be at most 200 characters'),

  description: z
    .string()
    .trim()
    .max(5000, 'Task description is too long')
    .nullable()
    .optional(),

  status: z
    .enum([
      'TODO',
      'IN_PROGRESS',
      'IN_REVIEW',
      'DONE',
      'CANCELLED',
    ])
    .default('TODO'),

  priority: z
    .enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
    .default('MEDIUM'),

  assignedToId: z
    .string()
    .uuid('Invalid assignee ID')
    .nullable()
    .optional(),

  dueDate: z
    .coerce
    .date()
    .nullable()
    .optional(),
});

export const listTasksQuerySchema = z.object({
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(20),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>;