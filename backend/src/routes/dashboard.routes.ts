import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { DashbboardController } from '../controllers/dashboard.controller';

const router = Router();

router.use(authMiddleware);

router.get('/', DashbboardController.getJobSeekerDashboard);
router.get('/jobs', DashbboardController.getAvailableJobs);

export { router as DashboardRoutes };
