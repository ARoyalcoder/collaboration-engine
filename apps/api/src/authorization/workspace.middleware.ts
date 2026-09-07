import type {
    NextFunction,
    Request,
    Response,
} from 'express';

import { prisma } from '@collaboration-engine/database';

declare global {
    namespace Express {
        interface Request {
            workspaceMembership?: {
                workspaceId: string;
                userId: string;
                role: string;
            };
        }
    }
}

export async function requireWorkspaceMembership(
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

    if (typeof workspaceId !== 'string' || !workspaceId) {
        res.status(400).json({
            error: {
                code: 'WORKSPACE_ID_REQUIRED',
                message: 'Workspace ID is required',
            },
        });

        return;
    }

    const membership =
        await prisma.workspaceMember.findUnique({
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

    req.workspaceMembership = membership;

    next();
}   