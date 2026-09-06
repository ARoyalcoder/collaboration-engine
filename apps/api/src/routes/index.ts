import { Router } from 'express';
import authRouter from '../modules/auth/auth.routes.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'collaboration-engine-api',
  });
});
router.use('/auth', authRouter);


export default router;