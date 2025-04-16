import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { Application, ApplicationStatus } from '../entities/Application';
import { Job } from '../entities/Job';
import { User } from '../entities/User';

export class ApplicationController {
  static async getAllApplications(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.body.userId; // From JWT middleware
      const userRole = req.body.userRole;

      const applicationRepository = AppDataSource.getRepository(Application);
      let applications;

      // Different logic based on user role
      if (userRole === 'seeker') {
        // Job seekers can only see their own applications
        applications = await applicationRepository.find({
          where: { user: { id: userId } },
          relations: ['job', 'job.postedBy'],
          order: { appliedDate: 'DESC' },
        });
      } else if (userRole === 'employer') {
        // Employers can see applications for their jobs
        applications = await applicationRepository
          .createQueryBuilder('application')
          .leftJoinAndSelect('application.job', 'job')
          .leftJoinAndSelect('application.user', 'applicant')
          .leftJoinAndSelect('applicant.profile', 'profile')
          .where('job.postedBy = :userId', { userId })
          .orderBy('application.appliedDate', 'DESC')
          .getMany();

        // Remove sensitive information
        applications = applications.map((app) => {
          if (app.user) {
            const { passwordHash, ...userWithoutPassword } = app.user;
            app.user = userWithoutPassword as User;
          }
          return app;
        });
      } else {
        res.status(403).json({ error: 'Unauthorized access' });
        return;
      }

      res.json(applications);
    } catch (error) {
      console.error('Error getting applications:', error);
      next(error);
    }
  }

  static async createApplication(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { jobId, coverLetter } = req.body;
      const userId = req.body.userId; // From JWT middleware
      const userRole = req.body.userRole;

      // Check if user is a job seeker
      if (userRole !== 'seeker') {
        res.status(403).json({ error: 'Only job seekers can apply for jobs' });
        return;
      }

      // Check if job exists
      const jobRepository = AppDataSource.getRepository(Job);
      const job = await jobRepository.findOne({ where: { id: jobId } });

      if (!job) {
        res.status(404).json({ error: 'Job not found' });
        return;
      }

      // Check if user already applied to this job
      const applicationRepository = AppDataSource.getRepository(Application);
      const existingApplication = await applicationRepository.findOne({
        where: {
          job: { id: jobId },
          user: { id: userId },
        },
      });

      if (existingApplication) {
        res.status(400).json({ error: 'You have already applied to this job' });
        return;
      }

      // Get user
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { id: userId } });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // Create new application
      const application = new Application();
      application.job = job;
      application.user = user;
      application.coverLetter = coverLetter;
      application.status = ApplicationStatus.PENDING; // Using enum value
      application.appliedDate = new Date();

      const savedApplication = await applicationRepository.save(application);

      res.status(201).json(savedApplication);
    } catch (error) {
      console.error('Error creating application:', error);
      next(error);
    }
  }

  static async getApplicationById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const applicationId = req.params.id; // UUID string
      const userId = req.body.userId; // From JWT middleware
      const userRole = req.body.userRole;

      const applicationRepository = AppDataSource.getRepository(Application);
      const application = await applicationRepository.findOne({
        where: { id: applicationId },
        relations: ['job', 'job.postedBy', 'user', 'user.profile'],
      });

      if (!application) {
        res.status(404).json({ error: 'Application not found' });
        return;
      }

      // Check authorization
      if (
        (userRole === 'seeker' && application.user.id !== userId) ||
        (userRole === 'employer' && application.job.postedBy.id !== userId)
      ) {
        res
          .status(403)
          .json({ error: 'Not authorized to view this application' });
        return;
      }

      // Remove sensitive information
      if (application.user) {
        const { passwordHash, ...userWithoutPassword } = application.user;
        application.user = userWithoutPassword as User;
      }

      if (application.job.postedBy) {
        const { passwordHash, ...employerWithoutPassword } =
          application.job.postedBy;
        application.job.postedBy = employerWithoutPassword as User;
      }

      res.json(application);
    } catch (error) {
      console.error('Error getting application by ID:', error);
      next(error);
    }
  }

  static async updateApplicationStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const applicationId = req.params.id; // UUID string
      const { status } = req.body;
      const userId = req.body.userId; // From JWT middleware
      const userRole = req.body.userRole;

      if (userRole !== 'employer') {
        res
          .status(403)
          .json({ error: 'Only employers can update application status' });
        return;
      }

      const applicationRepository = AppDataSource.getRepository(Application);
      const application = await applicationRepository.findOne({
        where: { id: applicationId },
        relations: ['job', 'job.postedBy'],
      });

      if (!application) {
        res.status(404).json({ error: 'Application not found' });
        return;
      }

      // Check if this employer posted the job
      if (application.job.postedBy.id !== userId) {
        res
          .status(403)
          .json({ error: 'Not authorized to update this application' });
        return;
      }

      // Validate status
      const validStatus = Object.values(ApplicationStatus).includes(
        status as ApplicationStatus
      );
      if (!validStatus) {
        res.status(400).json({
          error: 'Invalid status value',
          validValues: Object.values(ApplicationStatus),
        });
        return;
      }

      // Update status
      application.status = status as ApplicationStatus;
      const updatedApplication = await applicationRepository.save(application);

      res.json(updatedApplication);
    } catch (error) {
      console.error('Error updating application status:', error);
      next(error);
    }
  }

  static async withdrawApplication(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const applicationId = req.params.id; // UUID string
      const userId = req.body.userId; // From JWT middleware
      const userRole = req.body.userRole;

      if (userRole !== 'seeker') {
        res
          .status(403)
          .json({ error: 'Only job seekers can withdraw applications' });
        return;
      }

      const applicationRepository = AppDataSource.getRepository(Application);
      const application = await applicationRepository.findOne({
        where: { id: applicationId },
        relations: ['user'],
      });

      if (!application) {
        res.status(404).json({ error: 'Application not found' });
        return;
      }

      if (application.user.id !== userId) {
        res
          .status(403)
          .json({ error: 'Not authorized to withdraw this application' });
        return;
      }

      // Instead of deleting, set status to WITHDRAWN
      application.status = ApplicationStatus.WITHDRAWN;
      await applicationRepository.save(application);

      res.json({ message: 'Application withdrawn successfully' });
    } catch (error) {
      console.error('Error withdrawing application:', error);
      next(error);
    }
  }
}
