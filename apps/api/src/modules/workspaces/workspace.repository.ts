import { prisma } from '@collaboration-engine/database';
import { UpdateWorkspaceInput } from './workspace.schema.js';
 
export async function createWorkspace(
  organizationId: string,
  name: string,
  userId: string,
) {
  return prisma.$transaction(async (tx) => {
    const workspace = await tx.workspace.create({
      data: {
        organizationId,
        name,
      },
    });

    await tx.workspaceMember.create({
      data: {
        workspaceId: workspace.id,
        userId,
        role: 'OWNER',
      },
    });

    return workspace;
  });
}


export async function findWorkspacesForUser(
  userId: string,
) {
  return prisma.workspace.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function deleteWorkspace(
  workspaceId: string,
) {
  return prisma.workspace.delete({
    where: {
      id: workspaceId,
    },
  });
}

export async function updateWorkspace(
  workspaceId: string,
  input: UpdateWorkspaceInput,
) {
  return prisma.workspace.update({
    where: {
      id: workspaceId,
    },
    data: {
      name: input.name,
    },
    select: {
      id: true,
      organizationId: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}