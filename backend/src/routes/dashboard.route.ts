import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { DashboardController } from '../controllers/dashboard.controller';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Job seeker routes
router.get('/seeker', DashboardController.getJobSeekerDashboard);
router.get('/available-jobs', DashboardController.getAvailableJobs);
router.get('/applications', DashboardController.getSeekerApplications);

// Employer routes
router.get('/employer', DashboardController.getEmployerDashboard);
router.get('/employer/analytics', DashboardController.getEmployerAnalytics);

export { router as DashboardRoutes };
