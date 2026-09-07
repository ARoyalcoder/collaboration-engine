import { Router } from 'express';

import { requireAuth } from '../auth/auth.middleware.js';

import {
  createWorkspaceController,
  deleteWorkspaceController,
  getUserWorkspacesController,
  getWorkspaceController,
  updateWorkspaceController,
} from './workspace.controller.js';
import { requireWorkspaceMembership } from '../../authorization/workspace.middleware.js';
import { requireWorkspacePermission } from '../../authorization/authorization.middleware.js';
import { PERMISSIONS } from '../../authorization/permissions.js';

const router = Router();

router.post(
  '/',
  requireAuth,
  createWorkspaceController,
);

router.get(
  '/',
  requireAuth,
  getUserWorkspacesController,
);

router.get(
  '/:workspaceId',
  requireAuth,
  requireWorkspaceMembership,
  getUserWorkspacesController,
);

router.get(
  '/:workspaceId',
  requireAuth,
  requireWorkspaceMembership,
  getWorkspaceController,
);

router.patch(
  '/:workspaceId',
  requireAuth,
  requireWorkspacePermission(
    PERMISSIONS.WORKSPACE_UPDATE,
  ),
  updateWorkspaceController,
);

router.delete(
  '/:workspaceId',
  requireAuth,
  requireWorkspacePermission(
    PERMISSIONS.WORKSPACE_DELETE,
  ),
  deleteWorkspaceController,
);


export default router;