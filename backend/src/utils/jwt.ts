import jwt from 'jsonwebtoken';
import { Secret } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserRole } from '../entities/User';

dotenv.config();

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'your-secret-key';
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY || '7d';

export interface JWTPayload {
  id: string;
  email: string;
  role: UserRole;
}

/**
 * Generate a JWT token for a user
 * @param payload - The payload of the user
 * @returns The generated JWT token
 */
export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY as jwt.SignOptions['expiresIn'],
  });
};

/**
 * Verify and decode a JWT token
 * @param token - The JWT token to verify
 * @returns The decoded token payload or null if invalid
 */
export const verifyToken = async (token: string): Promise<JWTPayload> => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};
