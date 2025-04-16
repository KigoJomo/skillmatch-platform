import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { verifyToken, JWTPayload } from '../utils/jwt';
import { AppError } from './errorMiddleware';
import { UserRole } from '../entities/User';

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

/**
 * Middleware to protect routes that require authentication
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      const error = new Error('No token provided') as AppError;
      error.statusCode = 401;
      throw error;
    }

    const decoded = await verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to restrict access based on user role
 * @param roles - Array of roles allowed to access the route
 */
export const authorize = (roles: UserRole[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        const error = new Error('User not authenticated') as AppError;
        error.statusCode = 401;
        throw error;
      }

      if (!roles.includes(req.user.role)) {
        const error = new Error('Not authorized') as AppError;
        error.statusCode = 403;
        throw error;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
