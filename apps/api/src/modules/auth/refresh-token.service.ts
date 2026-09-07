import { createHash, randomBytes } from 'node:crypto';
import { createAccessToken } from './token.service.js';



export function generateRefreshToken(): string {
    return randomBytes(64).toString('base64url');
}

export function hashRefreshToken(token: string): string {
    return createHash('sha256')
        .update(token)
        .digest('hex');
}

import { prisma } from '@collaboration-engine/database';

export async function createRefreshToken(
    userId: string,
): Promise<string> {
    const token = generateRefreshToken();

    const tokenHash = hashRefreshToken(token);

    const expiresAt = new Date();

    expiresAt.setDate(
        expiresAt.getDate() +
        Number(process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS ?? 7),
    );

    await prisma.refreshToken.create({
        data: {
            userId,
            tokenHash,
            expiresAt,
        },
    });

    return token;
}


export async function refreshAccessToken(
    refreshToken: string,
) {
    const tokenHash = hashRefreshToken(refreshToken);

    const storedToken = await prisma.refreshToken.findUnique({
        where: {
            tokenHash,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    status: true,
                },
            },
        },
    });

    if (!storedToken) {
        throw new Error('INVALID_REFRESH_TOKEN');
    }

    if (storedToken.revokedAt) {
        throw new Error('INVALID_REFRESH_TOKEN');
    }

    if (storedToken.expiresAt <= new Date()) {
        throw new Error('INVALID_REFRESH_TOKEN');
    }

    if (storedToken.user.status !== 'ACTIVE') {
        throw new Error('ACCOUNT_NOT_ACTIVE');
    }

    await prisma.refreshToken.update({
        where: {
            id: storedToken.id,
        },
        data: {
            revokedAt: new Date(),
        },
    });

    const newRefreshToken = await createRefreshToken(
        storedToken.user.id,
    );

    const accessToken = await createAccessToken(
        storedToken.user.id,
    );

    return {
        accessToken,
        refreshToken: newRefreshToken,
        user: storedToken.user,
    };


}


export async function revokeRefreshToken(
    refreshToken: string,
): Promise<void> {
    const tokenHash = hashRefreshToken(refreshToken);

    await prisma.refreshToken.updateMany({
        where: {
            tokenHash,
            revokedAt: null,
        },
        data: {
            revokedAt: new Date(),
        },
    });
}