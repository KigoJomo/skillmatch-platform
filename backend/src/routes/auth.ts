import { Router, Request, Response, NextFunction } from 'express';
import { AuthController } from '../controllers/AuthController';
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
const register = wrapHandler(AuthController.register.bind(AuthController));
const login = wrapHandler(AuthController.login.bind(AuthController));
const getUser = wrapHandler(AuthController.getUser.bind(AuthController));

// Routes
router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.get('/users/:id', asyncHandler(getUser));

export default router;
