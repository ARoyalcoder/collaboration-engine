import { Router } from 'express';
import type { Server } from 'socket.io';

import type { TaskEvent } from '@collaboration-engine/shared';

import { projectRoom } from '../rooms/room.utils.js';

const router = Router();

export function createInternalEventRouter(io: Server): Router {
  router.post('/events', (req, res) => {
    const secret = req.header('x-internal-event-secret');

    if (!secret || secret !== process.env.INTERNAL_EVENT_SECRET) {
      res.status(401).json({
        error: {
          code: 'INVALID_INTERNAL_SECRET',
          message: 'Invalid internal event secret',
        },
      });

      return;
    }

    const event = req.body as TaskEvent;

    if (!event || typeof event.type !== 'string') {
      res.status(400).json({
        error: {
          code: 'INVALID_EVENT',
          message: 'Invalid event payload',
        },
      });

      return;
    }

    io.to(projectRoom(event.projectId)).emit(event.type, event);

    res.status(202).json({
      success: true,
    });
  });

  return router;
}