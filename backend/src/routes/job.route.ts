import express from 'express';
import { JobController } from '../controllers/job.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Job CRUD routes
router.post('/', JobController.createJob);
router.get('/recruiter', JobController.getRecruiterJobs);
router.get('/:id', JobController.getJobDetails);
router.put('/:id', JobController.updateJob);
router.delete('/:id', JobController.deleteJob);

// Job status management
router.patch('/:id/status', JobController.updateJobStatus);

// Job applications management
router.get('/:id/applications', JobController.getJobApplications);
router.patch(
  '/:jobId/applications/:applicationId/status',
  JobController.updateApplicationStatus
)
export { router as JobRoutes };
