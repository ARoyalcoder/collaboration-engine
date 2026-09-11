import type { Request, Response } from 'express';
import { searchSchema } from './search.schema.js';
import { searchTasks } from './search.service.js';

export async function searchController(
  req: Request,
  res: Response,
): Promise<void> {
  const input = searchSchema.parse(req.query);

  const tasks = await searchTasks(
    req.params.workspaceId as string,
    input,
  );

  res.status(200).json({
    data: {
      tasks,
    },
  });
}