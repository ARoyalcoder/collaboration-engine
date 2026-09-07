import { Router } from 'express';

import { requireAuth } from '../auth/auth.middleware.js';

import {
    requireWorkspacePermission,
} from '../../authorization/authorization.middleware.js';

import {
    PERMISSIONS,
} from '../../authorization/permissions.js';

import {
    addMemberController,
    listMembersController,
    removeMemberController,
    updateMemberRoleController,
} from './member.controller.js';

const router = Router();

router.get(
    '/:workspaceId/members',
    requireAuth,
    requireWorkspacePermission(
        PERMISSIONS.MEMBER_VIEW,
    ),
    listMembersController,
);

router.post(
    '/:workspaceId/members',
    requireAuth,
    requireWorkspacePermission(
        PERMISSIONS.MEMBER_INVITE,
    ),
    addMemberController,
);

router.patch(
    '/:workspaceId/members/:userId',
    requireAuth,
    requireWorkspacePermission(
        PERMISSIONS.MEMBER_ROLE_UPDATE,
    ),
    updateMemberRoleController,
);

router.delete(
    '/:workspaceId/members/:userId',
    requireAuth,
    requireWorkspacePermission(
        PERMISSIONS.MEMBER_REMOVE,
    ),
    removeMemberController,
);

export default router;