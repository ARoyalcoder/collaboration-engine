import { Router } from 'express';
import { registerController, meController, refreshController, loginController, logoutController } from './auth.controller.js';
import { requireAuth } from './auth.middleware.js';

const router = Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.get('/me', requireAuth, meController);
router.post('/refresh', refreshController);
router.post('/logout', requireAuth, logoutController);
export default router;