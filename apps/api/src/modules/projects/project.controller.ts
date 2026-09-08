import type { Request, Response } from 'express';

import {
    createProjectSchema,
    updateProjectSchema,
} from './project.schema.js';

import {
    createProject,
    deleteProject,
    getProject,
    listProjects,
    updateProject,
} from './project.service.js';

export async function createProjectController(
    req: Request,
    res: Response,
): Promise<void> {
    if (!req.user) {
        res.status(401).json({
            error: {
                code: 'AUTHENTICATION_REQUIRED',
                message: 'Authentication is required',
            },
        });

        return;
    }

    const result = createProjectSchema.safeParse(
        req.body,
    );

    if (!result.success) {
        res.status(400).json({
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Invalid project data',
                details: result.error.flatten().fieldErrors,
            },
        });

        return;
    }

    const project = await createProject(
        req.params.workspaceId as string,
        req.user.id,
        result.data,
    );

    res.status(201).json({
        project,
    });
}


export async function listProjectsController(
    req: Request,
    res: Response,
): Promise<void> {
    const projects = await listProjects(
        req.params.workspaceId as string,
    );

    res.status(200).json({
        projects,
    });
}


export async function getProjectController(
  req: Request,
  res: Response,
): Promise<void> {
  const project = await getProject(
    req.params.workspaceId as string ,
    req.params.projectId as string ,
  );

  if (!project) {
    res.status(404).json({
      error: {
        code: 'PROJECT_NOT_FOUND',
        message: 'Project not found',
      },
    });

    return;
  }

  res.status(200).json({
    project,
  });
}


export async function updateProjectController(
  req: Request,
  res: Response,
): Promise<void> {
  const result = updateProjectSchema.safeParse(
    req.body,
  );

  if (!result.success) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid project data',
        details: result.error.flatten().fieldErrors,
      },
    });

    return;
  }

  try {
    const project = await updateProject(
      req.params.workspaceId as string ,
      req.params.projectId as string ,
      result.data,
    );

    res.status(200).json({
      project,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === 'PROJECT_NOT_FOUND'
    ) {
      res.status(404).json({
        error: {
          code: 'PROJECT_NOT_FOUND',
          message: 'Project not found',
        },
      });

      return;
    }

    throw error;
  }
}


export async function deleteProjectController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    await deleteProject(
      req.params.workspaceId as string ,
      req.params.projectId as string  ,
    );

    res.status(204).send();
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === 'PROJECT_NOT_FOUND'
    ) {
      res.status(404).json({
        error: {
          code: 'PROJECT_NOT_FOUND',
          message: 'Project not found',
        },
      });

      return;
    }

    throw error;
  }
}