import { Router } from 'express';
import authRouter from '../modules/auth/auth.routes.js';
import workspaceRouter from '../modules/workspaces/workspace.routes.js';
import memberRouter from '../modules/members/member.routes.js';
import projectRouter from '../modules/projects/project.routes.js';
import taskRouter from '../modules/tasks/task.routes.js';
import commentRouter from '../modules/comments/comment.routes.js';
import activityRouter from '../modules/activity/activity.routes.js';
import searchRouter from '../modules/search/search.routes.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'collaboration-engine-api',
  });
});



router.use('/auth', authRouter);
router.use('/workspaces', workspaceRouter);
router.use('/workspaces', memberRouter);
router.use('/workspaces', projectRouter);
router.use('/workspaces', taskRouter);
router.use('/workspaces', commentRouter);
router.use('/workspaces', activityRouter);
router.use('/workspaces', searchRouter);



export default router;