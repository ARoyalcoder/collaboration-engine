import { prisma } from '@collaboration-engine/database';

export async function canAccessTask(
  workspaceId: string,
  projectId: string,
  taskId: string,
  userId: string,
): Promise<boolean> {
  const membership =
    await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
      select: {
        id: true,
      },
    });

  if (!membership) {
    return false;
  }

  const task =
    await prisma.task.findFirst({
      where: {
        id: taskId,
        projectId,
        project: {
          workspaceId,
        },
      },
      select: {
        id: true,
      },
    });

  return Boolean(task);
}