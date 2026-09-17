import type { Server as HttpServer } from 'node:http';
import type { Socket } from 'socket.io';
import {
  Server,
} from 'socket.io';

import { env } from '../config/env.js';

import {
  authenticateSocket,
} from './socket-auth.middleware.js';

import {
  registerSocketHandlers,
} from './socket.handlers.js';

export function createSocketServer(
  httpServer: HttpServer,
) {
  const io = new Server(
    httpServer,
    {
      cors: {
        origin: env.webOrigin,
      },
    },
  );

  io.use(
    (
      socket: Socket,
      next,
    ) => {
      void authenticateSocket(
        socket,
        next,
      );
    },
  );

  io.on(
    'connection',
    (socket) => {
      registerSocketHandlers(
        socket,
      );
    },
  );

  return io;
}