import { Router } from 'express';

const router = Router();

router.get(
  '/',
  (_req, res) => {
    res.status(200).json({
      status: 'ok',
      service:
        'collaboration-engine-websocket',
    });
  },
);

export default router;