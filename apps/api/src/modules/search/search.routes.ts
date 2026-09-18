import { Router } from 'express';

import { requireAuth } from '../auth/auth.middleware.js';

 

import {
  searchController,
} from './search.controller.js';
import { PERMISSIONS } from '../../authorization/permissions.js';
import { requireWorkspacePermission } from '../../authorization/authorization.middleware.js';

const router = Router();

router.get(
  '/:workspaceId/search',
  requireAuth,
  requireWorkspacePermission(
    PERMISSIONS.TASK_VIEW   ,
  ),
  searchController,
);

export default router;