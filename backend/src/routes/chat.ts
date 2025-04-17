import { Router, Request, Response, NextFunction } from 'express';
import { ChatController } from '../controllers/ChatController';
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
const getAllSessions = wrapHandler(
  ChatController.getAllSessions.bind(ChatController)
);
const createSession = wrapHandler(
  ChatController.createSession.bind(ChatController)
);
const getSession = wrapHandler(ChatController.getSession.bind(ChatController));
const getMessages = wrapHandler(
  ChatController.getMessages.bind(ChatController)
);
const sendMessage = wrapHandler(
  ChatController.sendMessage.bind(ChatController)
);

// Protected routes - all routes require authentication
router.use(authenticate);

// Routes without parameters first
router.get('/sessions', asyncHandler(getAllSessions));
router.post('/sessions', asyncHandler(createSession));

// Routes with parameters last
router.get('/sessions/:id', asyncHandler(getSession));
router.get('/sessions/:id/messages', asyncHandler(getMessages));
router.post('/sessions/:id/messages', asyncHandler(sendMessage));

export default router;
