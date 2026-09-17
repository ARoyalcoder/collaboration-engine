import express from 'express';
import { createServer } from 'node:http';

import { env } from './config/env.js';
import healthRouter from './http/health.js';
import { createInternalEventRouter } from './http/internal-events.js';
import { createSocketServer } from './socket/socket.server.js';

const app = express();

app.use(
  express.json(),
);

app.use(
  '/health',
  healthRouter,
);

const httpServer =
  createServer(app);

const io = createSocketServer(
  httpServer,
);

app.use(
  '/internal',
  createInternalEventRouter(io),
);

httpServer.listen(
  env.port,
  () => {
    console.log(
      `WebSocket server running on http://localhost:${env.port}`,
    );
  },
);