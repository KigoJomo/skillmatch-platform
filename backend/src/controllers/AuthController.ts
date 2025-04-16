// filepath: /home/roci/Athena/qa-qe/skillmatch/backend/src/controllers/AuthController.ts
import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { Profile } from '../entities/Profile';
import { generateToken } from '../utils/jwt';
import bcrypt from 'bcrypt';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body;

      // Check if user already exists
      const userExists = await AppDataSource.getRepository(User).findOne({
        where: { email },
      });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Create new user
      const user = new User();
      user.name = name;
      user.email = email;
      user.passwordHash = passwordHash;
      user.role = role;

      const savedUser = await AppDataSource.getRepository(User).save(user);

      // Create a profile for user
      const profile = new Profile();
      profile.user = savedUser;
      await AppDataSource.getRepository(Profile).save(profile);

      // Generate JWT token
      const token = generateToken(savedUser.id);

      return res.status(201).json({
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        token,
      });
    } catch (error) {
      console.error('Registration error:', error);
      return res
        .status(500)
        .json({ error: 'Server error during registration' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await AppDataSource.getRepository(User).findOne({
        where: { email },
      });

      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      // Verify password
      const passwordValid = await bcrypt.compare(password, user.passwordHash);
      if (!passwordValid) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = generateToken(user.id);

      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ error: 'Server error during login' });
    }
  }

  static async getUser(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const user = await AppDataSource.getRepository(User).findOne({
        where: { id: parseInt(userId) },
        relations: ['profile'],
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Don't return password hash
      const { passwordHash, ...userWithoutPassword } = user;
      return res.json(userWithoutPassword);
    } catch (error) {
      console.error('Get user error:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }
}
