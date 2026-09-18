import { prisma } from '@collaboration-engine/database';
import type { Prisma } from '@collaboration-engine/database';
import type { CreateActivityInput } from './activity.types.js';


export async function createActivity(
    input: CreateActivityInput,
) {
    return prisma.activityLog.create({
        data: {
            workspaceId: input.workspaceId,
            userId: input.userId,
            action: input.action,
            entityType: input.entityType,
            entityId: input.entityId,
            metadata: input.metadata as Prisma.InputJsonValue | undefined,
        },
    });
}


export async function listWorkspaceActivity(
  workspaceId: string,
  limit: number,
) {
  return prisma.activityLog.findMany({
    where: {
      workspaceId,
    },

    take: limit,

    orderBy: {
      createdAt: 'desc',
    },

    select: {
      id: true,
      action: true,
      entityType: true,
      entityId: true,
      metadata: true,
      createdAt: true,

      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}