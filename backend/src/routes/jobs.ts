import { Router, Request, Response, NextFunction } from 'express';
import { JobController } from '../controllers/JobController';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { asyncHandler } from '../middleware/errorMiddleware';
import { UserRole } from '../entities/User';

const router = Router();

// Convert controller methods to return Promise<void>
const wrapHandler = (fn: Function) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    await fn(req, res, next);
  };
};

// Wrap controller methods
const getAllJobs = wrapHandler(JobController.getAllJobs.bind(JobController));
const createJob = wrapHandler(JobController.createJob.bind(JobController));
const getJobById = wrapHandler(JobController.getJobById.bind(JobController));
const updateJob = wrapHandler(JobController.updateJob.bind(JobController));
const deleteJob = wrapHandler(JobController.deleteJob.bind(JobController));

// Public routes
router.get('/', asyncHandler(getAllJobs));

// Protected routes with authentication and authorization
router.post(
  '/',
  authenticate,
  authorize([UserRole.EMPLOYER]),
  asyncHandler(createJob)
);

// Routes with parameters should come last
router.get('/:id', asyncHandler(getJobById));
router.put(
  '/:id',
  authenticate,
  authorize([UserRole.EMPLOYER]),
  asyncHandler(updateJob)
);
router.delete(
  '/:id',
  authenticate,
  authorize([UserRole.EMPLOYER]),
  asyncHandler(deleteJob)
);

export default router;
