import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Profile } from '../entities/Profile';
import { User } from '../entities/User';
import { AuthRequest } from '../middleware/auth.middleware';
import { Project } from '../entities/Project';

const userRepository = AppDataSource.getRepository(User);
const profileRepository = AppDataSource.getRepository(Profile);
const projectRepository = AppDataSource.getRepository(Project);

export class ProfileController {
  static async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const profile = await profileRepository.findOne({
        where: { user: { id: userId } },
        relations: ['user'],
      });

      if (!profile) {
        res.status(404).json({ error: 'Profile not found' });
        return;
      }

      res.json(profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  }

  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const updateData = req.body;

      const profile = await profileRepository.findOne({
        where: { user: { id: userId } },
        relations: ['user'],
      });

      if (!profile) {
        res.status(404).json({ error: 'Profile not found' });
        return;
      }

      // Update only the fields that are provided
      Object.assign(profile, updateData);

      const updatedProfile = await profileRepository.save(profile);
      res.json(updatedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: 'Failed to update profile' });
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
        user.profile = { ...user.profile, ...req.body };
      }

      user.onboardingCompleted = true;
      const updatedUser = await userRepository.save(user);

      console.log(updatedUser)

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

  static async getUserProjects(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;

      const projects = await projectRepository.find({
        where: { user: { id: userId } },
        relations: ['user'],
      });
      res.json(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  }

  static async createProject(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const projectData = req.body;

      const project = projectRepository.create({
        ...projectData,
        user: { id: userId },
      });

      const savedProject = await projectRepository.save(project);
      res.json(savedProject);
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({ error: 'Failed to create project' });
    }
  }

  static async deleteProject(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const projectId = req.params.id;

      const project = await projectRepository.findOne({
        where: { id: projectId, user: { id: userId } },
      });

      if (!project) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }

      await projectRepository.remove(project);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({ error: 'Failed to delete project' });
    }
  }
}
