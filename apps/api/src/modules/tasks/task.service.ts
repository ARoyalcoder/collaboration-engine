import { prisma } from '@collaboration-engine/database';
import type {
    CreateTaskInput,
    ListTasksQuery,
} from './task.schema.js';

async function verifyProject(
    workspaceId: string,
    projectId: string,
) {
    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            workspaceId,
        },
        select: {
            id: true,
            workspaceId: true,
        },
    });

    if (!project) {
        throw new Error('PROJECT_NOT_FOUND');
    }

    return project;
}

async function verifyAssignee(
    workspaceId: string,
    assignedToId: string,
) {
    const membership = await prisma.workspaceMember.findUnique({
        where: {
            workspaceId_userId: {
                workspaceId,
                userId: assignedToId,
            },
        },
        select: {
            userId: true,
        },
    });

    if (!membership) {
        throw new Error('ASSIGNEE_NOT_IN_WORKSPACE');
    }
}

export async function createTask(
    workspaceId: string,
    projectId: string,
    userId: string,
    input: CreateTaskInput,
) {
    await verifyProject(workspaceId, projectId);

    if (input.assignedToId) {
        await verifyAssignee(
            workspaceId,
            input.assignedToId,
        );
    }

    const task = await prisma.task.create({
        data: {
            projectId,
            title: input.title,
            description: input.description ?? null,
            status: input.status === 'IN_REVIEW' ? 'REVIEW' : input.status,
            priority: input.priority,
            assignedToId: input.assignedToId ?? null,
            createdById: userId,
            dueDate: input.dueDate ?? null,
        },

        select: {   
            id: true,
            projectId: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            assignedToId: true,
            createdById: true,
            dueDate: true,
            version: true,
            createdAt: true,
            updatedAt: true,

            createdBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },

            assignedTo: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    return task;
}

export async function listTasks(
    workspaceId: string,
    projectId: string,
    query: ListTasksQuery,
) {
    await verifyProject(workspaceId, projectId);

    return prisma.task.findMany({
        where: {
            projectId,
            project: {
                workspaceId,
            },
        },

        take: query.limit,

        orderBy: {
            createdAt: 'desc',
        },

        select: {
            id: true,
            projectId: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            assignedToId: true,
            createdById: true,
            dueDate: true,
            version: true,
            createdAt: true,
            updatedAt: true,

            createdBy: {
                select: {
                    id: true,
                    name: true,
                },
            },

            assignedTo: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });
}

export async function getTask(
    workspaceId: string,
    projectId: string,
    taskId: string,
) {
    const task = await prisma.task.findFirst({
        where: {
            id: taskId,
            projectId,
            project: {
                workspaceId,
            },
        },

        select: {
            id: true,
            projectId: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            assignedToId: true,
            createdById: true,
            dueDate: true,
            version: true,
            createdAt: true,
            updatedAt: true,

            createdBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },

            assignedTo: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    if (!task) {
        throw new Error('TASK_NOT_FOUND');
    }

    return task;
}