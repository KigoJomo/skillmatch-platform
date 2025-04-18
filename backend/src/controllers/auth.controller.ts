import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User, UserRole } from '../entities/User';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';

const userRepository = AppDataSource.getRepository(User);

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName, role } = req.body;

      const existingUser = await userRepository.findOne({ where: { email } });

      if (existingUser) {
        res.status(400).json({ error: 'Email already registered' });
        return
      }

      const passwordHash = await hash(password, 10);

      const user = userRepository.create({
        email,
        passwordHash,
        role: role === 'Employer/Recruiter' ? UserRole.EMPLOYER : UserRole.SEEKER,
        profile: {
          firstName,
          lastName,
        },
      });

      await userRepository.save(user);

      const token = sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName,
          lastName,
        },
        token,
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
      return
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await userRepository.findOne({
        where: { email },
        relations: ['profile'],
      });

      if (!user) {
        res.status(401).json({ error: 'Invalid Credentials' });
        return
      }

      const isValidPassword = await compare(password, user?.passwordHash!);

      if (!isValidPassword) {
        res.status(401).json({ error: 'Invaid Credentials' });
        return
      }

      const token = sign(
        { id: user?.id, email: user?.email, role: user?.role },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );

      res.json({
        user: {
          id: user?.id,
          email: user?.email,
          role: user?.role,
          firstName: user?.profile.firstName,
          lastName: user?.profile.lastName,
        },
        token,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
      return
    }
  }
}
