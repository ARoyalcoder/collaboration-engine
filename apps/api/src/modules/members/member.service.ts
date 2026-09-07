import { prisma } from '@collaboration-engine/database';

import type {
    AddMemberInput,
    UpdateMemberRoleInput,
} from './member.schema.js';

export async function listMembers(
    workspaceId: string,
) {
    return prisma.workspaceMember.findMany({
        where: {
            workspaceId,
        },
        select: {
            id: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    status: true,
                },
            },
        },
        orderBy: {
            createdAt: 'asc',
        },
    });
}


export async function addMember(
    workspaceId: string,
    input: AddMemberInput,
) {
    const email = input.email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
        where: {
            email,
        },
        select: {
            id: true,
            name: true,
            email: true,
            status: true,
        },
    });

    if (!user) {
        throw new Error('USER_NOT_FOUND');
    }

    if (user.status !== 'ACTIVE') {
        throw new Error('USER_NOT_ACTIVE');
    }

    const existingMembership =
        await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId: user.id,
                },
            },
        });

    if (existingMembership) {
        throw new Error('ALREADY_MEMBER');
    }

    const membership =
        await prisma.workspaceMember.create({
            data: {
                workspaceId,
                userId: user.id,
                role: input.role,
            },
            select: {
                id: true,
                workspaceId: true,
                userId: true,
                role: true,
                createdAt: true,
            },
        });

    return {
        membership,
        user,
    };
}



export async function updateMemberRole(
    workspaceId: string,
    userId: string,
    input: UpdateMemberRoleInput,
    actorRole: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER',
) {
    const membership =
        await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId,
                },
            },
        });

    if (!membership) {
        throw new Error('MEMBER_NOT_FOUND');
    }

    if (membership.role === 'OWNER') {
        throw new Error('CANNOT_CHANGE_OWNER_ROLE');
    }

    if (
        actorRole === 'ADMIN' &&
        input.role === 'ADMIN'
    ) {
        throw new Error('ADMIN_CANNOT_ASSIGN_ADMIN');
    }

    const updatedMembership =
        await prisma.workspaceMember.update({
            where: {
                id: membership.id,
            },
            data: {
                role: input.role,
            },
            select: {
                id: true,
                workspaceId: true,
                userId: true,
                role: true,
                updatedAt: true,
            },
        });

    return updatedMembership;
}

export async function removeMember(
  workspaceId: string,
  userId: string,
) {
  const membership =
    await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
    });

  if (!membership) {
    throw new Error('MEMBER_NOT_FOUND');
  }

  if (membership.role === 'OWNER') {
    throw new Error('CANNOT_REMOVE_OWNER');
  }

  await prisma.workspaceMember.delete({
    where: {
      id: membership.id,
    },
  });
}