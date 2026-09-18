import type { Socket } from 'socket.io';

import { verifyAccessToken } from '../auth/socket-auth.service.js';

export async function authenticateSocket(
  socket: Socket,
  next: (error?: Error) => void,
): Promise<void> {
  try {
    const token =
      socket.handshake.auth?.token;

    if (
      typeof token !== 'string' ||
      token.length === 0
    ) {
      return next(
        new Error(
          'AUTHENTICATION_REQUIRED',
        ),
      );
    }

    const user =
      await verifyAccessToken(token);

    socket.data.user = user;

    next();
  } catch {
    next(
      new Error(
        'INVALID_AUTHENTICATION',
      ),
    );
  }
}