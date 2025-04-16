import { Router, Request, Response, NextFunction } from 'express';
import { ProfileController } from '../controllers/ProfileController';
import { authenticate } from '../middleware/authMiddleware';
import { asyncHandler } from '../middleware/errorMiddleware';

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
const getProfile = wrapHandler(
  ProfileController.getProfile.bind(ProfileController)
);
const updateProfile = wrapHandler(
  ProfileController.updateProfile.bind(ProfileController)
);
const getProfileById = wrapHandler(
  ProfileController.getProfileById.bind(ProfileController)
);
const uploadResume = wrapHandler(
  ProfileController.uploadResume.bind(ProfileController)
);
const uploadAvatar = wrapHandler(
  ProfileController.uploadAvatar.bind(ProfileController)
);

// Protected routes - all routes require authentication
router.use(authenticate);

router.get('/', asyncHandler(getProfile));
router.put('/', asyncHandler(updateProfile));
router.get('/:id', asyncHandler(getProfileById));
router.post('/resume', asyncHandler(uploadResume));
router.post('/avatar', asyncHandler(uploadAvatar));

export default router;
