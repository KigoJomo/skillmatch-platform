import { Response } from 'express';
import { AppDataSource } from '../data-source';
import { Profile } from '../entities/Profile';
import { User } from '../entities/User';
import { AuthRequest } from '../middleware/auth.middleware';

const userRepository = AppDataSource.getRepository(User);
const profileRepository = AppDataSource.getRepository(Profile);

export class ProfileController {
  static async getProfile(req: AuthRequest, res: Response) {
    try {
      const user = await userRepository.findOne({
        where: { id: req.user?.id },
        relations: ['profile'],
      });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json(user.profile);
      return;
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  }

  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      const user = await userRepository.findOne({
        where: {
          id: req.user?.id,
        },
      });

      if (!user) {
        res.status(404).json({ error: 'User not found.' });
      }

      const updatedProfile = await profileRepository.save({
        ...user?.profile,
        ...req.body,
      });

      res.json(updatedProfile);
      return;
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
      return;
    }
  }

  static async completeOnboarding(req: AuthRequest, res: Response) {
    try {
      const user = await userRepository.findOne({
        where: { id: req.user?.id },
        relations: ['profile'],
      });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      if (!user.profile) {
        const newProfile = profileRepository.create({
          user: user,
          ...req.body,
        });
        await profileRepository.save(newProfile);
      } else {
        user.profile = { ...user.profile, ...req.body }
      }

      user.onboardingCompleted = true;
      await userRepository.save(user);

      res.json({ message: 'Onboarding completed successfully!' });
      return;
    } catch (error) {
      console.error('Complete onboarding error:', error);
      res.status(500).json({ error: 'Failed to complete onboarding' });
      return;
    }
  }

  static async skipOnboarding(req: AuthRequest, res: Response) {
    try {
      const user = await userRepository.findOne({
        where: { id: req.user?.id },
      });

      if (!user) {
        res.status(404).json({ error: 'User not found.' });
        return;
      }

      user.onboardingCompleted = false;
      await userRepository.save(user);

      res.json({ message: 'Onboarding skipped' });
      return;
    } catch (error) {
      console.error('Skip onboarding error:', error);
      res.status(500).json({ error: 'Failed to skip onboarding' });
      return;
    }
  }
}
