import type { Request, Response } from 'express';
import {
  createTaskSchema,
  listTasksQuerySchema,
} from './task.schema.js';
import {
  createTask,
  getTask,
  listTasks,
} from './task.service.js';

export async function createTaskController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const input = createTaskSchema.parse(req.body);

    if (!req.user) {
      res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
      return;
    }

    const task = await createTask(
      req.params.workspaceId as string ,
      req.params.projectId as string ,
      req.user.id,
      input,
    );

    res.status(201).json({
      data: task,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'PROJECT_NOT_FOUND') {
        res.status(404).json({
          error: {
            code: 'PROJECT_NOT_FOUND',
            message: 'Project not found',
          },
        });
        return;
      }

      if (error.message === 'ASSIGNEE_NOT_IN_WORKSPACE') {
        res.status(400).json({
          error: {
            code: 'ASSIGNEE_NOT_IN_WORKSPACE',
            message: 'Assignee is not a member of this workspace',
          },
        });
        return;
      }
    }

    throw error;
  }
}

export async function listTasksController(
  req: Request,
  res: Response,
): Promise<void> {
  const query = listTasksQuerySchema.parse(req.query);

  const tasks = await listTasks(
    req.params.workspaceId as string,
    req.params.projectId as string,
    query,
  );

  res.status(200).json({
    data: tasks,
  });
}

export async function getTaskController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const task = await getTask(
      req.params.workspaceId    as string,
      req.params.projectId as string,
      req.params.taskId as string,
    );

    res.status(200).json({
      data: task,
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