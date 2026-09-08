import { Router } from 'express';

import { requireAuth } from '../auth/auth.middleware.js';

import {
    requireWorkspacePermission,
} from '../../authorization/authorization.middleware.js';

import {
    PERMISSIONS,
} from '../../authorization/permissions.js';

import {
    createProjectController,
    deleteProjectController,
    getProjectController,
    listProjectsController,
    updateProjectController,
} from './project.controller.js';

const router = Router();

router.post(
    '/:workspaceId/projects',
    requireAuth,
    requireWorkspacePermission(
        PERMISSIONS.PROJECT_CREATE,
    ),
    createProjectController,
);

router.get(
    '/:workspaceId/projects',
    requireAuth,
    requireWorkspacePermission(
        PERMISSIONS.PROJECT_VIEW,
    ),
    listProjectsController,
);

router.get(
    '/:workspaceId/projects/:projectId',
    requireAuth,
    requireWorkspacePermission(
        PERMISSIONS.PROJECT_VIEW,
    ),
    getProjectController,
);

router.patch(
    '/:workspaceId/projects/:projectId',
    requireAuth,
    requireWorkspacePermission(
        PERMISSIONS.PROJECT_UPDATE,
    ),
    updateProjectController,
);

router.delete(
    '/:workspaceId/projects/:projectId',
    requireAuth,
    requireWorkspacePermission(
        PERMISSIONS.PROJECT_DELETE,
    ),
    deleteProjectController,
);

export default router;