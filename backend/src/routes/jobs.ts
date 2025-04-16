// filepath: /home/roci/Athena/qa-qe/skillmatch/backend/src/routes/jobs.ts
import { Router } from 'express';
import { JobController } from '../controllers/JobController';

const router = Router();

// GET /api/jobs - Get all jobs with optional filters
router.get('/', JobController.getAllJobs);

// POST /api/jobs - Create a new job
router.post('/', JobController.createJob);

// GET /api/jobs/:id - Get job by ID
router.get('/:id', JobController.getJobById);

// PUT /api/jobs/:id - Update job by ID
router.put('/:id', JobController.updateJob);

// DELETE /api/jobs/:id - Delete job by ID
router.delete('/:id', JobController.deleteJob);

export default router;
