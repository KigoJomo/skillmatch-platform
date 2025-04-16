import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { Profile } from '../entities/Profile';
import { User } from '../entities/User';

export class ProfileController {
  static async getProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.body.userId; // From JWT middleware

      const profileRepository = AppDataSource.getRepository(Profile);
      const profile = await profileRepository.findOne({
        where: { user: { id: userId } },
        relations: ['user'],
      });

      if (!profile) {
        res.status(404).json({ error: 'Profile not found' });
        return;
      }

      // Remove sensitive information
      if (profile.user) {
        const { passwordHash, ...userWithoutPassword } = profile.user;
        profile.user = userWithoutPassword as User;
      }

      res.json(profile);
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.body.userId; // From JWT middleware
      const userRole = req.body.userRole;
      const {
        bio,
        skills,
        experience,
        location,
        education,
        avatarUrl,
        resumeUrl,
        linkedIn,
        github,
        website,
        companyName,
        companySize,
        industry,
      } = req.body;

      const profileRepository = AppDataSource.getRepository(Profile);
      let profile = await profileRepository.findOne({
        where: { user: { id: userId } },
        relations: ['user'],
      });

      if (!profile) {
        res.status(404).json({ error: 'Profile not found' });
        return;
      }

      // Update profile fields
      if (bio !== undefined) profile.bio = bio;
      if (skills !== undefined) profile.skills = skills;
      if (experience !== undefined) profile.experience = experience;
      if (location !== undefined) profile.location = location;
      if (education !== undefined) profile.education = education;
      if (avatarUrl !== undefined) profile.avatarUrl = avatarUrl;
      if (resumeUrl !== undefined) profile.resumeUrl = resumeUrl;
      if (linkedIn !== undefined) profile.linkedIn = linkedIn;
      if (github !== undefined) profile.github = github;
      if (website !== undefined) profile.website = website;

      // Update employer-specific fields if user is an employer
      if (userRole === 'employer') {
        if (companyName !== undefined) profile.companyName = companyName;
        if (companySize !== undefined) profile.companySize = companySize;
        if (industry !== undefined) profile.industry = industry;
      }

      const updatedProfile = await profileRepository.save(profile);

      // Remove sensitive information
      if (updatedProfile.user) {
        const { passwordHash, ...userWithoutPassword } = updatedProfile.user;
        updatedProfile.user = userWithoutPassword as User;
      }

      res.json(updatedProfile);
    } catch (error) {
      next(error);
    }
  }

  static async getProfileById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const profileId = req.params.id;

      const profileRepository = AppDataSource.getRepository(Profile);
      const profile = await profileRepository.findOne({
        where: { id: profileId },
        relations: ['user'],
      });

      if (!profile) {
        res.status(404).json({ error: 'Profile not found' });
        return;
      }

      // Remove sensitive information
      if (profile.user) {
        const { passwordHash, ...userWithoutPassword } = profile.user;
        profile.user = userWithoutPassword as User;
      }

      res.json(profile);
    } catch (error) {
      next(error);
    }
  }

  static async uploadResume(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // NOTE: This is a placeholder for file upload functionality
      // In a real implementation, you would use a library like multer to handle file uploads
      // and integrate with a service like AWS S3 for storage

      const userId = req.body.userId;
      const resumeUrl = `https://storage.example.com/${userId}/resume.pdf`;

      const profileRepository = AppDataSource.getRepository(Profile);
      let profile = await profileRepository.findOne({
        where: { user: { id: userId } },
      });

      if (!profile) {
        res.status(404).json({ error: 'Profile not found' });
        return;
      }

      profile.resumeUrl = resumeUrl;
      await profileRepository.save(profile);

      res.json({
        message: 'Resume uploaded successfully',
        resumeUrl,
      });
    } catch (error) {
      next(error);
    }
  }

  static async uploadAvatar(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // NOTE: This is a placeholder for file upload functionality
      // In a real implementation, you would use a library like multer to handle file uploads
      // and integrate with a service like AWS S3 for storage

      const userId = req.body.userId;
      const avatarUrl = `https://storage.example.com/${userId}/avatar.jpg`;

      const profileRepository = AppDataSource.getRepository(Profile);
      let profile = await profileRepository.findOne({
        where: { user: { id: userId } },
      });

      if (!profile) {
        res.status(404).json({ error: 'Profile not found' });
        return;
      }

      profile.avatarUrl = avatarUrl;
      await profileRepository.save(profile);

      res.json({
        message: 'Avatar uploaded successfully',
        avatarUrl,
      });
    } catch (error) {
      next(error);
    }
  }
}
