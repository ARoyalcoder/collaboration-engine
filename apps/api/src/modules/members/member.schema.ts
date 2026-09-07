import { z } from 'zod';

export const addMemberSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .max(254, 'Email is too long'),

  role: z
    .enum(['ADMIN', 'MEMBER', 'VIEWER'])
    .default('MEMBER'),
});

export const updateMemberRoleSchema = z.object({
  role: z.enum([
    'ADMIN',
    'MEMBER',
    'VIEWER',
  ]),
});

export type AddMemberInput =
  z.infer<typeof addMemberSchema>;

export type UpdateMemberRoleInput =
  z.infer<typeof updateMemberRoleSchema>;