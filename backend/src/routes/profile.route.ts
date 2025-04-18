import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { ProfileController } from '../controllers/profile.controller';

const router = Router();

router.use(authMiddleware);

router.get('/', ProfileController.getProfile);
router.patch('/', ProfileController.updateProfile);
router.post('/onboarding', ProfileController.completeOnboarding);
router.patch('/onboarding', ProfileController.skipOnboarding);

export { router as ProfileRoutes };
