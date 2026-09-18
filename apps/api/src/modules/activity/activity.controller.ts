import type { Request, Response } from 'express';
import { listWorkspaceActivity } from './activity.service.js';

export async function listActivityController(
  req: Request,
  res: Response,
): Promise<void> {
  const requestedLimit = Number(
    req.query.limit ?? 20,
  );

  const limit = Math.min(
    Math.max(requestedLimit || 20, 1),
    100,
  );

  const activities =
    await listWorkspaceActivity(
      req.params.workspaceId as string ,
      limit,
    );

  res.status(200).json({
    data: activities,
  });
}

