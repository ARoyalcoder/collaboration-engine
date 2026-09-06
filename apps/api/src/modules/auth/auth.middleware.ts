import type { NextFunction, Request, Response } from 'express';
import { jwtVerify } from 'jose';

import { prisma } from '@collaboration-engine/database';

const secret = process.env.JWT_ACCESS_SECRET;

if (!secret) {
  throw new Error('JWT_ACCESS_SECRET is not configured');
}

const secretKey = new TextEncoder().encode(secret);

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authorizationHeader = req.header('authorization');

  if (!authorizationHeader) {
    res.status(401).json({
      error: {
        code: 'AUTHENTICATION_REQUIRED',
        message: 'Authentication is required',
      },
    });

    return;
  }

  if (!authorizationHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: {
        code: 'INVALID_AUTHORIZATION_HEADER',
        message: 'Authorization header must use Bearer token format',
      },
    });

    return;
  }

  const token = authorizationHeader.slice(7).trim();

  if (!token) {
    res.status(401).json({
      error: {
        code: 'INVALID_TOKEN',
        message: 'Access token is missing',
      },
    });

    return;
  }

  let userId: string;

  try {
    const { payload } = await jwtVerify(token, secretKey, {
      issuer: 'collaboration-engine-api',
      audience: 'collaboration-engine',
    });

    if (!payload.sub) {
      res.status(401).json({
        error: {
          code: 'INVALID_TOKEN',
          message: 'Access token does not contain a user ID',
        },
      });

      return;
    }

    userId = payload.sub;
  } catch {
    res.status(401).json({
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired access token',
      },
    });

    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
    },
  });

  if (!user) {
    res.status(401).json({
      error: {
        code: 'USER_NOT_FOUND',
        message: 'User account could not be found',
      },
    });

    return;
  }

  if (user.status !== 'ACTIVE') {
    res.status(403).json({
      error: {
        code: 'ACCOUNT_NOT_ACTIVE',
        message: 'This account is not active',
      },
    });

    return;
  }

  req.user = user;

  next();
}