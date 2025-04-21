import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { DashbboardController } from '../controllers/dashboard.controller';

const router = Router();
const seekerRouter = Router();

router.use(authMiddleware);

seekerRouter.get('/', DashbboardController.getJobSeekerDashboard);
seekerRouter.get('/jobs', DashbboardController.getAvailableJobs);
seekerRouter.get('/applications', DashbboardController.getSeekerApplications);

router.use('/seeker', seekerRouter);

export { router as DashboardRoutes };
