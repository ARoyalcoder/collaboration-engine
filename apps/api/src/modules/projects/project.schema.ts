import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Project name must be at least 2 characters')
    .max(150, 'Project name must be at most 150 characters'),

  description: z
    .string()
    .trim()
    .max(2000, 'Description is too long')
    .optional(),

  status: z
    .enum([
      'PLANNING',
      'ACTIVE',
      'COMPLETED',
      'ARCHIVED',
    ])
    .default('PLANNING'),
});

export const updateProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Project name must be at least 2 characters')
    .max(150, 'Project name must be at most 150 characters')
    .optional(),

  description: z
    .string()
    .trim()
    .max(2000, 'Description is too long')
    .nullable()
    .optional(),

  status: z
    .enum([
      'PLANNING',
      'ACTIVE',
      'COMPLETED',
      'ARCHIVED',
    ])
    .optional(),
});

export type CreateProjectInput =
  z.infer<typeof createProjectSchema>;

export type UpdateProjectInput =
  z.infer<typeof updateProjectSchema>;