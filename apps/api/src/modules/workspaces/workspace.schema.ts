import { z } from 'zod';

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Workspace name must be at least 2 characters')
    .max(100, 'Workspace name must be at most 100 characters'),
});

export const updateWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Workspace name must be at least 2 characters')
    .max(100, 'Workspace name must be at most 100 characters'),
});

export type CreateWorkspaceInput =
  z.infer<typeof createWorkspaceSchema>;

export type UpdateWorkspaceInput =
  z.infer<typeof updateWorkspaceSchema>;