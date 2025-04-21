import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { ProfileController } from '../controllers/profile.controller';

const router = Router();

router.use(authMiddleware);

router.get('/', ProfileController.getProfile);
router.patch('/', ProfileController.updateProfile);
router.post('/onboarding', ProfileController.completeOnboarding);
router.patch('/onboarding', ProfileController.skipOnboarding);
router.get('/projects', ProfileController.getUserProjects);
router.post('/projects', ProfileController.createProject);
router.delete('/projects/:id', ProfileController.deleteProject);

export { router as ProfileRoutes };
