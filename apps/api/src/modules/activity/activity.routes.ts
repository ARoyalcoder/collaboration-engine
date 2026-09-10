import { Router } from 'express';

import { requireAuth } from '../auth/auth.middleware.js';


import {
    listActivityController,
} from './activity.controller.js';
import { PERMISSIONS } from '../../authorization/permissions.js';
import { requireWorkspacePermission } from '../../authorization/authorization.middleware.js';

const router = Router();

router.get(
    '/:workspaceId/activity',
    requireAuth,
    requireWorkspacePermission(
        PERMISSIONS.ACTIVITY_VIEW,
    ),
    listActivityController,
);

export default router;