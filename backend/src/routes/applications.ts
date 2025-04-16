import { Router, Request, Response, NextFunction } from 'express';
import { ApplicationController } from '../controllers/ApplicationController';
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
const getAllApplications = wrapHandler(
  ApplicationController.getAllApplications.bind(ApplicationController)
);
const createApplication = wrapHandler(
  ApplicationController.createApplication.bind(ApplicationController)
);
const getApplicationById = wrapHandler(
  ApplicationController.getApplicationById.bind(ApplicationController)
);
const updateStatus = wrapHandler(
  ApplicationController.updateApplicationStatus.bind(ApplicationController)
);
const withdrawApplication = wrapHandler(
  ApplicationController.withdrawApplication.bind(ApplicationController)
);

// Protected routes - all routes require authentication
router.use(authenticate);

router.get('/', asyncHandler(getAllApplications));
router.post('/', authorize([UserRole.SEEKER]), asyncHandler(createApplication));
router.get('/:id', asyncHandler(getApplicationById));
router.patch(
  '/:id/status',
  authorize([UserRole.EMPLOYER]),
  asyncHandler(updateStatus)
);
router.delete(
  '/:id',
  authorize([UserRole.SEEKER]),
  asyncHandler(withdrawApplication)
);

export default router;
