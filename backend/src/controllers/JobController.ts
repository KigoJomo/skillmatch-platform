// filepath: /home/roci/Athena/qa-qe/skillmatch/backend/src/controllers/JobController.ts
import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Job } from '../entities/Job';
import { User } from '../entities/User';

export class JobController {
  static async getAllJobs(req: Request, res: Response) {
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

      return res.json(jobs);
    } catch (error) {
      console.error('Error getting jobs:', error);
      return res
        .status(500)
        .json({ error: 'Server error while retrieving jobs' });
    }
  }

  static async createJob(req: Request, res: Response) {
    try {
      const { title, description, location, requirements, type, salary } =
        req.body;

      // Verify the user exists and is an employer
      const userId = req.body.userId; // Assume this comes from JWT middleware
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { id: userId } });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (user.role !== 'employer') {
        return res.status(403).json({ error: 'Only employers can post jobs' });
      }

      // Create new job
      const job = new Job();
      job.title = title;
      job.description = description;
      job.location = location;
      job.requirements = requirements;
      job.type = type;
      job.salary = salary;
      job.postedBy = user;
      job.postedDate = new Date();

      const savedJob = await AppDataSource.getRepository(Job).save(job);

      return res.status(201).json(savedJob);
    } catch (error) {
      console.error('Error creating job:', error);
      return res.status(500).json({ error: 'Server error while creating job' });
    }
  }

  static async getJobById(req: Request, res: Response) {
    try {
      const jobId = parseInt(req.params.id);

      const job = await AppDataSource.getRepository(Job).findOne({
        where: { id: jobId },
        relations: ['postedBy'],
      });

      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      // Hide sensitive employer data
      if (job.postedBy) {
        const { passwordHash, ...employerWithoutPassword } = job.postedBy;
        job.postedBy = employerWithoutPassword as User;
      }

      return res.json(job);
    } catch (error) {
      console.error('Error getting job by ID:', error);
      return res
        .status(500)
        .json({ error: 'Server error while retrieving job' });
    }
  }

  static async updateJob(req: Request, res: Response) {
    try {
      const jobId = parseInt(req.params.id);
      const userId = req.body.userId; // From JWT middleware

      const jobRepository = AppDataSource.getRepository(Job);
      const job = await jobRepository.findOne({
        where: { id: jobId },
        relations: ['postedBy'],
      });

      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      // Check if user is the job poster
      if (job.postedBy.id !== userId) {
        return res
          .status(403)
          .json({ error: 'Not authorized to update this job' });
      }

      // Update job fields
      const { title, description, location, requirements, type, salary } =
        req.body;

      if (title) job.title = title;
      if (description) job.description = description;
      if (location) job.location = location;
      if (requirements) job.requirements = requirements;
      if (type) job.type = type;
      if (salary) job.salary = salary;

      const updatedJob = await jobRepository.save(job);
      return res.json(updatedJob);
    } catch (error) {
      console.error('Error updating job:', error);
      return res.status(500).json({ error: 'Server error while updating job' });
    }
  }

  static async deleteJob(req: Request, res: Response) {
    try {
      const jobId = parseInt(req.params.id);
      const userId = req.body.userId; // From JWT middleware

      const jobRepository = AppDataSource.getRepository(Job);
      const job = await jobRepository.findOne({
        where: { id: jobId },
        relations: ['postedBy'],
      });

      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      // Check if user is the job poster
      if (job.postedBy.id !== userId) {
        return res
          .status(403)
          .json({ error: 'Not authorized to delete this job' });
      }

      await jobRepository.remove(job);
      return res.json({ message: 'Job deleted successfully' });
    } catch (error) {
      console.error('Error deleting job:', error);
      return res.status(500).json({ error: 'Server error while deleting job' });
    }
  }
}
