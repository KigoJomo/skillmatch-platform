import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { Profile } from '../entities/Profile';
import { generateToken } from '../utils/jwt';
import bcrypt from 'bcrypt';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { firstName, lastName, email, password, role } = req.body;

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
      user.name = `${firstName} ${lastName}`.trim();
      user.email = email;
      user.passwordHash = passwordHash;
      user.role = role;

      const userRepository = AppDataSource.getRepository(User);
      const profileRepository = AppDataSource.getRepository(Profile);

      const savedUser = await userRepository.save(user);

      // Create a profile for user
      const profile = new Profile();
      profile.user = savedUser;
      await profileRepository.save(profile);

      // Generate JWT token
      const token = generateToken({
        id: savedUser.id,
        email: savedUser.email,
        role: savedUser.role,
      });

      // Format response
      const { passwordHash: _, ...userWithoutPassword } = savedUser;
      const responseUser = {
        ...userWithoutPassword,
        firstName,
        lastName,
        onboardingCompleted: false,
      };

      return res.status(201).json({
        user: responseUser,
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

      // Find user with profile
      const user = await AppDataSource.getRepository(User).findOne({
        where: { email },
        relations: ['profile'],
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
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      // Remove sensitive data
      const { passwordHash, ...userWithoutPassword } = user;

      // Check if profile has basic info to determine onboarding status
      const onboardingCompleted = !!(
        user.profile &&
        (user.profile.bio || user.profile.location)
      );

      // Structure the response correctly
      return res.json({
        user: {
          // Nest user data under 'user' key
          ...userWithoutPassword,
          firstName: user.name.split(' ')[0],
          lastName: user.name.split(' ')[1] || '',
          onboardingCompleted,
        },
        token, // Keep token at the top level
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
        where: { id: userId }, // Changed from parseInt(userId)
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
