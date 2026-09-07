import type { Request, Response } from 'express';

import {
    createWorkspaceSchema,
    updateWorkspaceSchema,
} from './workspace.schema.js';

import {
    createWorkspace,
    deleteWorkspace,
    getUserWorkspaces,
    getWorkspace,
    updateWorkspace,
} from './workspace.service.js';

export async function createWorkspaceController(
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

    const result = createWorkspaceSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Invalid workspace data',
                details: result.error.flatten().fieldErrors,
            },
        });

        return;
    }

    const workspace = await createWorkspace(
        req.user.id,
        result.data,
    );

    res.status(201).json({
        workspace,
    });
}



export async function getUserWorkspacesController(
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

    const workspaces = await getUserWorkspaces(
        req.user.id,
    );

    res.status(200).json({
        workspaces,
    });
}


export async function getWorkspaceController(
    req: Request,
    res: Response,
): Promise<void> {
    const workspace = await getWorkspace(
        String(req.params.workspaceId),
    );

    if (!workspace) {
        res.status(404).json({
            error: {
                code: 'WORKSPACE_NOT_FOUND',
                message: 'Workspace not found',
            },
        });

        return;
    }

    res.status(200).json({
        workspace,
    });
}


export async function updateWorkspaceController(
  req: Request,
  res: Response,
): Promise<void> {
  const result = updateWorkspaceSchema.safeParse(
    req.body,
  );

  if (!result.success) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid workspace data',
        details: result.error.flatten().fieldErrors,
      },
    });

    return;
  }

  const workspace = await updateWorkspace(
    (req.params.workspaceId as string),
    result.data,
  );

  res.status(200).json({
    workspace,
  });
}


export async function deleteWorkspaceController(
  req: Request,
  res: Response,
): Promise<void> {
  await deleteWorkspace(
    (req.params.workspaceId as string),
  );

  res.status(204).send();
}