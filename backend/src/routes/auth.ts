// filepath: /home/roci/Athena/qa-qe/skillmatch/backend/src/routes/auth.ts
import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = Router();

// POST /api/auth/register
router.post('/register', AuthController.register);

// POST /api/auth/login
router.post('/login', AuthController.login);

// GET /api/users/:id
router.get('/users/:id', AuthController.getUser);

export default router;
