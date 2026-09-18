import { jwtVerify } from 'jose';

import { prisma } from '@collaboration-engine/database';

import { env } from '../config/env.js';
import type { SocketUser } from '../socket/socket.types.js';

const secretKey = new TextEncoder().encode(env.jwtAccessSecret);

export async function verifyAccessToken(
  token: string,
): Promise<SocketUser> {
  const { payload } =
    await jwtVerify(
      token,
      secretKey,
      {
        issuer:
          'collaboration-engine-api',
        audience:
          'collaboration-engine',
      },
    );

  const userId = payload.sub;

  if (!userId) {
    throw new Error(
      'JWT subject is missing',
    );
  }

  const user =
    await prisma.user.findUnique({
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
    throw new Error(
      'USER_NOT_FOUND',
    );
  }

  if (user.status !== 'ACTIVE') {
    throw new Error(
      'USER_NOT_ACTIVE',
    );
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}