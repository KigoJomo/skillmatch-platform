import { Request, Response, NextFunction, RequestHandler } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  errors?: any[];
}

interface AsyncRequestHandler extends RequestHandler {
  (req: Request, res: Response, next: NextFunction): Promise<void>;
}

/**
 * Error handler middleware for consistent API error responses
 */
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;

  // Log error for server-side debugging
  console.error(`[Error] ${req.method} ${req.url}:`, err);

  // Format response
  const response = {
    error: true,
    message: err.message || 'Internal Server Error',
    ...(err.errors && { errors: err.errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};

/**
 * Middleware to handle 404 Not Found for undefined routes
 */
export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new Error(`Not Found - ${req.originalUrl}`) as AppError;
  error.statusCode = 404;
  next(error);
};

/**
 * Utility function to create an error with status code
 */
export const createError = (message: string, statusCode: number): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  return error;
};

/**
 * Async handler to avoid try/catch blocks in route handlers
 * Ensures proper error propagation for async routes
 */
export const asyncHandler = (fn: AsyncRequestHandler): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware to sanitize URLs before they reach the router
 */
export const urlSanitizer = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // If the URL contains a protocol, respond with 400 Bad Request
  if (req.url.match(/^https?:\/\//i)) {
    const error = new Error(
      'Invalid URL format: URLs should not include protocol'
    ) as AppError;
    error.statusCode = 400;
    next(error);
    return;
  }
  next();
};
