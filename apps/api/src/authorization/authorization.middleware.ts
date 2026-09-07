import type {
    NextFunction,
    Request,
    Response,
} from 'express';

import { prisma } from '@collaboration-engine/database';

import {
    hasPermission,
} from './permission.utils.js';

import type {
    Permission,
} from './permissions.js';

export function requireWorkspacePermission(
    permission: Permission,
) {
    return async function workspacePermissionMiddleware(
        req: Request,
        res: Response,
        next: NextFunction,
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

        const workspaceId = req.params.workspaceId;

        if (!workspaceId || Array.isArray(workspaceId)) {
            res.status(400).json({
                error: {
                    code: 'WORKSPACE_ID_REQUIRED',
                    message: 'Workspace ID is required',
                },
            });

            return;
        }

        const membership = await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId: req.user.id,
                },
            },
            select: {
                workspaceId: true,
                userId: true,
                role: true,
            },
        });

        if (!membership) {
            res.status(403).json({
                error: {
                    code: 'WORKSPACE_ACCESS_DENIED',
                    message: 'You are not a member of this workspace',
                },
            });

            return;
        }

        if (!hasPermission(membership.role, permission)) {
            res.status(403).json({
                error: {
                    code: 'PERMISSION_DENIED',
                    message: 'You do not have permission to perform this action',
                },
            });

            return;
        }

        (req as Request & { workspaceMembership: typeof membership }).workspaceMembership = membership;

        next();
    };
}