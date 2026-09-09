import { Router } from 'express';

import { requireAuth } from '../auth/auth.middleware.js';

 

import {
  createCommentController,
  listCommentsController,
  updateCommentController,
  deleteCommentController,
} from './comment.controller.js';
import { PERMISSIONS } from '../../authorization/permissions.js';
import { requireWorkspacePermission } from '../../authorization/authorization.middleware.js';

const router = Router();

router.post(
  '/:workspaceId/projects/:projectId/tasks/:taskId/comments',
  requireAuth,
  requireWorkspacePermission(
    PERMISSIONS.COMMENT_CREATE,
  ),
  createCommentController,
);

router.get(
  '/:workspaceId/projects/:projectId/tasks/:taskId/comments',
  requireAuth,
  requireWorkspacePermission(
    PERMISSIONS.COMMENT_VIEW,
  ),
  listCommentsController,
);

router.patch(
  '/:workspaceId/projects/:projectId/tasks/:taskId/comments/:commentId',
  requireAuth,
  requireWorkspacePermission(
    PERMISSIONS.COMMENT_UPDATE,
  ),
  updateCommentController,
);

router.delete(
  '/:workspaceId/projects/:projectId/tasks/:taskId/comments/:commentId',
  requireAuth,
  requireWorkspacePermission(
    PERMISSIONS.COMMENT_DELETE,
  ),
  deleteCommentController,
);

export default router;