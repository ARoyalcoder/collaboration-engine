import type { Request, Response } from 'express';

import {
  createCommentSchema,
  updateCommentSchema,
  listCommentsQuerySchema,
} from './comment.schema.js';

import {
  createComment,
  deleteComment,
  listComments,
  updateComment,
} from './comment.service.js';

export async function createCommentController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const input =
      createCommentSchema.parse(req.body);

    if (!req.user) {
      res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
      return;
    }

    const comment = await createComment(
      req.params.workspaceId as string  ,
      req.params.projectId as string,
      req.params.taskId as string,
      req.user.id,
      input,
    );

    res.status(201).json({
      data: comment,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === 'TASK_NOT_FOUND'
    ) {
      res.status(404).json({
        error: {
          code: 'TASK_NOT_FOUND',
          message: 'Task not found',
        },
      });
      return;
    }

    throw error;
  }
}


export async function listCommentsController(
  req: Request,
  res: Response,
): Promise<void> {
  const query =
    listCommentsQuerySchema.parse(req.query);

  const comments = await listComments(
    req.params.workspaceId as string,
    req.params.projectId as string,
    req.params.taskId as string,
    query,
  );

  res.status(200).json({
    data: comments,
  });
}

export async function updateCommentController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const input =
      updateCommentSchema.parse(req.body);

    if (!req.user) {
      res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
      return;
    }

    const comment = await updateComment(
      req.params.workspaceId as string,
      req.params.projectId as string,
      req.params.taskId as string,
      req.params.commentId as string,
      req.user.id,
      input,
    );

    res.status(200).json({
      data: comment,
    });
  } catch (error) {
    if (!(error instanceof Error)) {
      throw error;
    }

    if (error.message === 'TASK_NOT_FOUND') {
      res.status(404).json({
        error: {
          code: 'TASK_NOT_FOUND',
          message: 'Task not found',
        },
      });
      return;
    }

    if (error.message === 'COMMENT_NOT_FOUND') {
      res.status(404).json({
        error: {
          code: 'COMMENT_NOT_FOUND',
          message: 'Comment not found',
        },
      });
      return;
    }

    if (error.message === 'COMMENT_FORBIDDEN') {
      res.status(403).json({
        error: {
          code: 'COMMENT_FORBIDDEN',
          message:
            'You can only modify your own comment',
        },
      });
      return;
    }

    throw error;
  }
}

export async function deleteCommentController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
      return;
    }

    await deleteComment(
      req.params.workspaceId as string,
      req.params.projectId as string,
      req.params.taskId as string,
      req.params.commentId as string,
      req.user.id as string,
    );

    res.status(204).send();
  } catch (error) {
    if (!(error instanceof Error)) {
      throw error;
    }

    if (error.message === 'TASK_NOT_FOUND') {
      res.status(404).json({
        error: {
          code: 'TASK_NOT_FOUND',
          message: 'Task not found',
        },
      });
      return;
    }

    if (error.message === 'COMMENT_NOT_FOUND') {
      res.status(404).json({
        error: {
          code: 'COMMENT_NOT_FOUND',
          message: 'Comment not found',
        },
      });
      return;
    }

    if (error.message === 'COMMENT_FORBIDDEN') {
      res.status(403).json({
        error: {
          code: 'COMMENT_FORBIDDEN',
          message:
            'You can only delete your own comment',
        },
      });
      return;
    }

    throw error;
  }
}