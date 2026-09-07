import { prisma } from '@collaboration-engine/database';
import { hashPassword } from './password.service.js';
import type { RegisterInput } from './auth.schema.js';
import { createRefreshToken } from './refresh-token.service.js';


export async function registerUser(input: RegisterInput) {
    const email = input.email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (existingUser) {
        throw new Error('EMAIL_ALREADY_EXISTS');
    }

    const passwordHash = await hashPassword(input.password);

    const user = await prisma.user.create({
        data: {
            name: input.name,
            email,
            passwordHash,
        },
        select: {
            id: true,
            name: true,
            email: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return user;
}




import { verifyPassword } from './password.service.js';
import { createAccessToken } from './token.service.js';
import type { LoginInput } from './auth.schema.js';

export async function loginUser(input: LoginInput) {
    const email = input.email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        throw new Error('INVALID_CREDENTIALS');
    }

    const passwordValid = await verifyPassword(
        input.password,
        user.passwordHash,
    );

    if (!passwordValid) {
        throw new Error('INVALID_CREDENTIALS');
    }

    if (user.status !== 'ACTIVE') {
        throw new Error('ACCOUNT_NOT_ACTIVE');
    }

    const accessToken = await createAccessToken(user.id);
    const refreshToken = await createRefreshToken(user.id);
    await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            lastLoginAt: new Date(),
        },
    });

    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            status: user.status,
        },
    };
}