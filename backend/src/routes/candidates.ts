import { Router, Request, Response, NextFunction } from 'express';
import { CandidateController } from '../controllers/CandidateController';
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
const getAllCandidates = wrapHandler(
  CandidateController.getAllCandidates.bind(CandidateController)
);
const getCandidateStats = wrapHandler(
  CandidateController.getCandidatesStats.bind(CandidateController)
);
const getCandidateById = wrapHandler(
  CandidateController.getCandidateById.bind(CandidateController)
);
const updateCandidateStatus = wrapHandler(
  CandidateController.updateCandidateStatus.bind(CandidateController)
);

// Protected routes - all routes require authentication and employer role
router.use(authenticate);
router.use(authorize([UserRole.EMPLOYER]));

// Routes without parameters first
router.get('/', asyncHandler(getAllCandidates));
router.get('/stats', asyncHandler(getCandidateStats));

// Routes with parameters last
router.get('/:id', asyncHandler(getCandidateById));
router.patch('/:id/status', asyncHandler(updateCandidateStatus));

export default router;
