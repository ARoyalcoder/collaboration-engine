import { prisma } from '@collaboration-engine/database';
import type {
    CreateWorkspaceInput,
    UpdateWorkspaceInput,
} from './workspace.schema.js';

export async function createWorkspace(
    userId: string,
    input: CreateWorkspaceInput,
) {
    const workspace = await prisma.$transaction(
        async (transaction) => {
            const createdWorkspace =
                await transaction.workspace.create({
                    data: {
                        name: input.name,
                        organization: {
                            create: {
                                name: `${input.name} Organization`,
                            },
                        },
                    },
                });

            await transaction.workspaceMember.create({
                data: {
                    workspaceId: createdWorkspace.id,
                    userId,
                    role: 'OWNER',
                },
            });

            return createdWorkspace;
        },
    );

    return workspace;
}

export async function getUserWorkspaces(
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
        select: {
            id: true,
            organizationId: true,
            name: true,
            createdAt: true,
            updatedAt: true,
            members: {
                where: {
                    userId,
                },
                select: {
                    role: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
}


export async function getWorkspace(
    workspaceId: string,
) {
    return prisma.workspace.findUnique({
        where: {
            id: workspaceId,
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


export async function deleteWorkspace(
  workspaceId: string,
): Promise<void> {
  await prisma.workspace.delete({
    where: {
      id: workspaceId,
    },
  });
}