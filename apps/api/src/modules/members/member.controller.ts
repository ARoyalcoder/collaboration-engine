import type { Request, Response } from 'express';

import {
    addMemberSchema,
    updateMemberRoleSchema,
} from './member.schema.js';

import {
    addMember,
    listMembers,
    removeMember,
    updateMemberRole,
} from './member.service.js';

export async function listMembersController(
    req: Request,
    res: Response,
): Promise<void> {
    const members = await listMembers(
        (req.params.workspaceId as string),
    );

    res.status(200).json({
        members,
    });
}


export async function addMemberController(
    req: Request,
    res: Response,
): Promise<void> {
    const result = addMemberSchema.safeParse(
        req.body,
    );

    if (!result.success) {
        res.status(400).json({
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Invalid member data',
                details: result.error.flatten().fieldErrors,
            },
        });

        return;
    }

    try {
        const resultData = await addMember(
            req.params.workspaceId as string,
            result.data,
        );

        res.status(201).json(resultData);
    } catch (error) {
        if (
            error instanceof Error &&
            error.message === 'USER_NOT_FOUND'
        ) {
            res.status(404).json({
                error: {
                    code: 'USER_NOT_FOUND',
                    message: 'User account could not be found',
                },
            });

            return;
        }

        if (
            error instanceof Error &&
            error.message === 'USER_NOT_ACTIVE'
        ) {
            res.status(403).json({
                error: {
                    code: 'USER_NOT_ACTIVE',
                    message: 'This user account is not active',
                },
            });

            return;
        }

        if (
            error instanceof Error &&
            error.message === 'ALREADY_MEMBER'
        ) {
            res.status(409).json({
                error: {
                    code: 'ALREADY_MEMBER',
                    message: 'User is already a member of this workspace',
                },
            });

            return;
        }

        throw error;
    }
}


export async function updateMemberRoleController(
    req: Request,
    res: Response,
): Promise<void> {
    if (!req.workspaceMembership) {
        res.status(403).json({
            error: {
                code: 'WORKSPACE_ACCESS_DENIED',
                message: 'Workspace membership is required',
            },
        });

        return;
    }

    const result = updateMemberRoleSchema.safeParse(
        req.body,
    );

    if (!result.success) {
        res.status(400).json({
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Invalid role',
                details: result.error.flatten().fieldErrors,
            },
        });

        return;
    }

    try {
        const membership =
            await updateMemberRole(
                req.params.workspaceId as string,
                req.params.userId as string,
                result.data,
                req.workspaceMembership.role as
                'ADMIN' | 'MEMBER' | 'VIEWER' | 'OWNER',
            );

        res.status(200).json({
            membership,
        });
    } catch (error) {
        if (
            error instanceof Error &&
            error.message === 'MEMBER_NOT_FOUND'
        ) {
            res.status(404).json({
                error: {
                    code: 'MEMBER_NOT_FOUND',
                    message: 'Workspace member not found',
                },
            });

            return;
        }

        if (
            error instanceof Error &&
            error.message ===
            'CANNOT_CHANGE_OWNER_ROLE'
        ) {
            res.status(403).json({
                error: {
                    code: 'CANNOT_CHANGE_OWNER_ROLE',
                    message: 'The workspace owner cannot be changed here',
                },
            });

            return;
        }

        if (
            error instanceof Error &&
            error.message ===
            'ADMIN_CANNOT_ASSIGN_ADMIN'
        ) {
            res.status(403).json({
                error: {
                    code: 'ADMIN_CANNOT_ASSIGN_ADMIN',
                    message: 'Administrators cannot assign the ADMIN role',
                },
            });

            return;
        }

        throw error;
    }
}




export async function removeMemberController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    await removeMember(
      req.params.workspaceId as string,
      req.params.userId as string,
    );

    res.status(204).send();
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === 'MEMBER_NOT_FOUND'
    ) {
      res.status(404).json({
        error: {
          code: 'MEMBER_NOT_FOUND',
          message: 'Workspace member not found',
        },
      });

      return;
    }

    if (
      error instanceof Error &&
      error.message === 'CANNOT_REMOVE_OWNER'
    ) {
      res.status(403).json({
        error: {
          code: 'CANNOT_REMOVE_OWNER',
          message: 'The workspace owner cannot be removed',
        },
      });

      return;
    }

    throw error;
  }
}