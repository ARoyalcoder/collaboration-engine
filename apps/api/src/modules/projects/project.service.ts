import { prisma } from '@collaboration-engine/database';

import type {
    CreateProjectInput,
    UpdateProjectInput,
} from './project.schema.js';

export async function createProject(
    workspaceId: string,
    userId: string,
    input: CreateProjectInput,
) {
    const project = await prisma.project.create({
        data: {
            workspaceId,
            name: input.name,
            description: input.description,
            status: input.status,
            createdById: userId,
        },
        select: {
            id: true,
            workspaceId: true,
            name: true,
            description: true,
            status: true,
            createdById: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return project;
}


export async function listProjects(
    workspaceId: string,
) {
    return prisma.project.findMany({
        where: {
            workspaceId,
        },
        select: {
            id: true,
            workspaceId: true,
            name: true,
            description: true,
            status: true,
            createdById: true,
            createdAt: true,
            updatedAt: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
}


export async function getProject(
    workspaceId: string,
    projectId: string,
) {
    return prisma.project.findFirst({
        where: {
            id: projectId,
            workspaceId,
        },
        select: {
            id: true,
            workspaceId: true,
            name: true,
            description: true,
            status: true,
            createdById: true,
            createdAt: true,
            updatedAt: true,
        },
    });
}

export async function updateProject(
    workspaceId: string,
    projectId: string,
    input: UpdateProjectInput,
) {
    const existingProject =
        await prisma.project.findFirst({
            where: {
                id: projectId,
                workspaceId,
            },
            select: {
                id: true,
            },
        });

    if (!existingProject) {
        throw new Error('PROJECT_NOT_FOUND');
    }

    return prisma.project.update({
        where: {
            id: existingProject.id,
        },
        data: {
            name: input.name,
            description: input.description,
            status: input.status,
        },
        select: {
            id: true,
            workspaceId: true,
            name: true,
            description: true,
            status: true,
            createdById: true,
            createdAt: true,
            updatedAt: true,
        },
    });
}


export async function deleteProject(
    workspaceId: string,
    projectId: string,
): Promise<void> {
    const existingProject =
        await prisma.project.findFirst({
            where: {
                id: projectId,
                workspaceId,
            },
            select: {
                id: true,
            },
        });

    if (!existingProject) {
        throw new Error('PROJECT_NOT_FOUND');
    }

    await prisma.project.delete({
        where: {
            id: existingProject.id,
        },
    });
}