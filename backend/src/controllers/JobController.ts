// filepath: /home/roci/Athena/qa-qe/skillmatch/backend/src/controllers/JobController.ts
import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { Job, JobType, ExperienceLevel } from '../entities/Job';
import { User } from '../entities/User';

export class JobController {
  static async getAllJobs(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const jobRepository = AppDataSource.getRepository(Job);

      // Add optional filters based on query parameters
      const { title, location, company } = req.query;

      let queryBuilder = jobRepository
        .createQueryBuilder('job')
        .leftJoinAndSelect('job.postedBy', 'user')
        .select(['job', 'user.id', 'user.name', 'user.company']);

      if (title) {
        queryBuilder = queryBuilder.andWhere('job.title ILIKE :title', {
          title: `%${title}%`,
        });
      }

      if (location) {
        queryBuilder = queryBuilder.andWhere('job.location ILIKE :location', {
          location: `%${location}%`,
        });
      }

      if (company) {
        queryBuilder = queryBuilder.andWhere('user.company ILIKE :company', {
          company: `%${company}%`,
        });
      }

      const jobs = await queryBuilder.getMany();
      res.json(jobs);
    } catch (error) {
      next(error);
    }
  }

  static async createJob(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        title,
        description,
        location,
        requiredSkills,
        jobType,
        salary,
        experienceLevel = ExperienceLevel.ENTRY,
        company,
      } = req.body;

      // Verify the user exists and is an employer
      const userId = req.body.userId; // From JWT middleware
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { id: userId } });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      if (user.role !== 'employer') {
        res.status(403).json({ error: 'Only employers can post jobs' });
        return;
      }

      // Create new job
      const job = new Job();
      job.title = title;
      job.description = description;
      job.location = location;
      job.requiredSkills = requiredSkills;
      job.jobType = jobType;
      job.salary = salary;
      job.experienceLevel = experienceLevel;
      job.company = company;
      job.postedBy = user;
      job.isActive = true;

      const savedJob = await AppDataSource.getRepository(Job).save(job);
      res.status(201).json(savedJob);
    } catch (error) {
      next(error);
    }
  }

  static async getJobById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const jobId = req.params.id;

      const job = await AppDataSource.getRepository(Job).findOne({
        where: { id: jobId },
        relations: ['postedBy'],
      });

      if (!job) {
        res.status(404).json({ error: 'Job not found' });
        return;
      }

      // Hide sensitive employer data
      if (job.postedBy) {
        const { passwordHash, ...employerWithoutPassword } = job.postedBy;
        job.postedBy = employerWithoutPassword as User;
      }

      res.json(job);
    } catch (error) {
      next(error);
    }
  }

  static async updateJob(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const jobId = req.params.id;
      const userId = req.body.userId; // From JWT middleware

      const jobRepository = AppDataSource.getRepository(Job);
      const job = await jobRepository.findOne({
        where: { id: jobId },
        relations: ['postedBy'],
      });

      if (!job) {
        res.status(404).json({ error: 'Job not found' });
        return;
      }

      // Check if user is the job poster
      if (job.postedBy.id !== userId) {
        res.status(403).json({ error: 'Not authorized to update this job' });
        return;
      }

      // Update job fields
      const {
        title,
        description,
        location,
        requiredSkills,
        jobType,
        salary,
        experienceLevel,
        company,
      } = req.body;

      if (title) job.title = title;
      if (description) job.description = description;
      if (location) job.location = location;
      if (requiredSkills) job.requiredSkills = requiredSkills;
      if (jobType) job.jobType = jobType;
      if (salary) job.salary = salary;
      if (experienceLevel) job.experienceLevel = experienceLevel;
      if (company) job.company = company;

      const updatedJob = await jobRepository.save(job);
      res.json(updatedJob);
    } catch (error) {
      next(error);
    }
  }

  static async deleteJob(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const jobId = req.params.id;
      const userId = req.body.userId; // From JWT middleware

      const jobRepository = AppDataSource.getRepository(Job);
      const job = await jobRepository.findOne({
        where: { id: jobId },
        relations: ['postedBy'],
      });

      if (!job) {
        res.status(404).json({ error: 'Job not found' });
        return;
      }

      // Check if user is the job poster
      if (job.postedBy.id !== userId) {
        res.status(403).json({ error: 'Not authorized to delete this job' });
        return;
      }

      await jobRepository.remove(job);
      res.json({ message: 'Job deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
