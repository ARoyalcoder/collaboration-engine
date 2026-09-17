import { prisma } from '@collaboration-engine/database';
import type {
    CreateCommentInput,
    UpdateCommentInput,
    ListCommentsQuery,
} from './comment.schema.js';

async function verifyTask(
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
        },
    });

    if (!task) {
        throw new Error('TASK_NOT_FOUND');
    }

    return task;
}

export async function createComment(
    workspaceId: string,
    projectId: string,
    taskId: string,
    userId: string,
    input: CreateCommentInput,
) {
    await verifyTask(
        workspaceId,
        projectId,
        taskId,
    );

    const comment =
        await prisma.taskComment.create({
            data: {
                taskId,
                userId,
                content: input.content,
            },

            select: {
                id: true,
                taskId: true,
                userId: true,
                content: true,
                createdAt: true,
                updatedAt: true,

                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

    return comment;
}


export async function listComments(
  workspaceId: string,
  projectId: string,
  taskId: string,
  query: ListCommentsQuery,
) {
  await verifyTask(
    workspaceId,
    projectId,
    taskId,
  );

  return prisma.taskComment.findMany({
    where: {
      taskId,
      task: {
        project: {
          workspaceId,
        },
      },
    },

    take: query.limit,

    orderBy: {
      createdAt: 'asc',
    },

    select: {
      id: true,
      taskId: true,
      userId: true,
      content: true,
      createdAt: true,
      updatedAt: true,

      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}


export async function updateComment(
  workspaceId: string,
  projectId: string,
  taskId: string,
  commentId: string,
  userId: string,
  input: UpdateCommentInput,
) {
  await verifyTask(
    workspaceId,
    projectId,
    taskId,
  );

  const existingComment =
    await prisma.taskComment.findFirst({
      where: {
        id: commentId,
        taskId,
      },

      select: {
        id: true,
        userId: true,
      },
    });

  if (!existingComment) {
    throw new Error('COMMENT_NOT_FOUND');
  }

  if (existingComment.userId !== userId) {
    throw new Error('COMMENT_FORBIDDEN');
  }

  const comment = await prisma.taskComment.update({
    where: {
      id: commentId,
    },
    data: {
      content: input.content,
    },
  });

  return comment;
}



export async function deleteComment(
  workspaceId: string,
  projectId: string,
  taskId: string,
  commentId: string,
  userId: string,
) {
  await verifyTask(
    workspaceId,
    projectId,
    taskId,
  );

  const comment =
    await prisma.taskComment.findFirst({
      where: {
        id: commentId,
        taskId,
      },

      select: {
        id: true,
        userId: true,
      },
    });

  if (!comment) {
    throw new Error('COMMENT_NOT_FOUND');
  }

  if (comment.userId !== userId) {
    throw new Error('COMMENT_FORBIDDEN');
  }

  await prisma.taskComment.delete({
    where: {
      id: commentId,
    },
  });
}