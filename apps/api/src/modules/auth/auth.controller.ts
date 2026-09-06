import type { Request, Response } from 'express';
import { registerSchema } from './auth.schema.js';
import { registerUser } from './auth.service.js';

export async function registerController(
    req: Request,
    res: Response,
): Promise<void> {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Invalid registration data',
                details: result.error.flatten().fieldErrors,
            },
        });

        return;
    }

    try {
        const user = await registerUser(result.data);

        res.status(201).json({
            user,
        });
    } catch (error) {
        if (error instanceof Error && error.message === 'EMAIL_ALREADY_EXISTS') {
            res.status(409).json({
                error: {
                    code: 'EMAIL_ALREADY_EXISTS',
                    message: 'An account with this email already exists',
                },
            });

            return;
        }

        throw error;
    }
}




import { loginSchema } from './auth.schema.js';
import { loginUser } from './auth.service.js';

export async function loginController(
    req: Request,
    res: Response,
): Promise<void> {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Invalid login data',
                details: result.error.flatten().fieldErrors,
            },
        });

        return;
    }

    try {
        const resultData = await loginUser(result.data);

        res.status(200).json(resultData);
    } catch (error) {
        if (error instanceof Error && error.message === 'INVALID_CREDENTIALS') {
            res.status(401).json({
                error: {
                    code: 'INVALID_CREDENTIALS',
                    message: 'Invalid email or password',
                },
            });

            return;
        }

        if (error instanceof Error && error.message === 'ACCOUNT_NOT_ACTIVE') {
            res.status(403).json({
                error: {
                    code: 'ACCOUNT_NOT_ACTIVE',
                    message: 'This account is not active',
                },
            });

            return;
        }

        throw error;
    }
}







export function meController(
    req: Request,
    res: Response,
): void {
    if (!req.user) {
        res.status(401).json({
            error: {
                code: 'AUTHENTICATION_REQUIRED',
                message: 'Authentication is required',
            },
        });

        return;
    }

    res.status(200).json({
        user: req.user,
    });
}