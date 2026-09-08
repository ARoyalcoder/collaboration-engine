import { Router } from 'express';
import { requireAuth } from '../auth/auth.middleware.js';


 
import {
  createTaskController,
  getTaskController,
  listTasksController,
} from './task.controller.js';
import { requireWorkspacePermission } from '../../authorization/authorization.middleware.js';
import { PERMISSIONS } from '../../authorization/permissions.js';



const router = Router();





router.post(
  '/:workspaceId/projects/:projectId/tasks',
  requireAuth,
  requireWorkspacePermission(PERMISSIONS.TASK_CREATE),
  createTaskController,
);

router.get(
  '/:workspaceId/projects/:projectId/tasks',
  requireAuth,
  requireWorkspacePermission(PERMISSIONS.TASK_VIEW),
  listTasksController,
);

router.get(
  '/:workspaceId/projects/:projectId/tasks/:taskId',
  requireAuth,
  requireWorkspacePermission(PERMISSIONS.TASK_VIEW),
  getTaskController,
);

export default router;