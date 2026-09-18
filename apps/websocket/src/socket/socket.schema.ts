import { z } from 'zod';

export const workspaceJoinSchema =
    z.object({
        workspaceId: z.string().uuid(),
    });

export const projectJoinSchema =
    z.object({
        workspaceId: z.string().uuid(),
        projectId: z.string().uuid(),
    });

export const taskJoinSchema =
    z.object({
        workspaceId: z.string().uuid(),
        projectId: z.string().uuid(),
        taskId: z.string().uuid(),
    });


export const commentCreatedEventSchema = z.object({
    eventId: z.string().uuid(),
    type: z.literal('comment.created'),

    workspaceId: z.string().uuid(),
    projectId: z.string().uuid(),
    taskId: z.string().uuid(),

    comment: z.object({
        id: z.string().uuid(),
        taskId: z.string().uuid(),
        userId: z.string().uuid(),
        content: z.string(),
        createdAt: z.string(),
        updatedAt: z.string(),
    }),

    actor: z.object({
        id: z.string().uuid(),
        name: z.string(),
    }),

    occurredAt: z.string(),
});