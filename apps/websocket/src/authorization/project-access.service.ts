import { prisma } from '@collaboration-engine/database';

export async function canAccessProject(
  workspaceId: string,
  projectId: string,
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

  const project =
    await prisma.project.findFirst({
      where: {
        id: projectId,
        workspaceId,
      },
      select: {
        id: true,
      },
    });

  return Boolean(project);
}