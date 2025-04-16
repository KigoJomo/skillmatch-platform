import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { Application, ApplicationStatus } from '../entities/Application';
import { User } from '../entities/User';
import { Job } from '../entities/Job';

export class CandidateController {
  /**
   * Get all candidates (applicants) for an employer's job listings
   * With optional filtering by job, status, and skills
   */
  static async getAllCandidates(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const employerId = req.body.userId; // From JWT middleware
      const userRole = req.body.userRole;

      // Ensure the user is an employer
      if (userRole !== 'employer') {
        res
          .status(403)
          .json({ error: 'Unauthorized: Only employers can view candidates' });
        return;
      }

      // Get filter parameters
      const { jobId, status, skill } = req.query;

      // Build query to get all applications for the employer's jobs
      let query = AppDataSource.getRepository(Application)
        .createQueryBuilder('application')
        .leftJoinAndSelect('application.job', 'job')
        .leftJoinAndSelect('application.user', 'user')
        .leftJoinAndSelect('user.profile', 'profile')
        .where('job.postedBy = :employerId', { employerId });

      // Add optional filters
      if (jobId) {
        query = query.andWhere('job.id = :jobId', { jobId });
      }

      if (status) {
        query = query.andWhere('application.status = :status', { status });
      }

      if (skill) {
        // Filter by skill in the profile's skills array
        query = query.andWhere('profile.skills LIKE :skill', {
          skill: `%${skill}%`,
        });
      }

      // Order by application date (newest first)
      query = query.orderBy('application.appliedDate', 'DESC');

      const applications = await query.getMany();

      // Transform applications to candidate format
      const candidates = applications.map((application) => {
        // Remove sensitive information
        if (application.user) {
          const { passwordHash, ...userWithoutPassword } = application.user;
          application.user = userWithoutPassword as User;
        }

        // Calculate a simple match score based on profile skills and job required skills
        // This is a placeholder for a more sophisticated matching algorithm
        let matchScore = 0;
        if (
          application.user.profile?.skills &&
          application.job.requiredSkills
        ) {
          const candidateSkills = application.user.profile.skills;
          const jobRequiredSkills = application.job.requiredSkills.map((r) =>
            r.trim().toLowerCase()
          );

          // Count matching skills
          const matchingSkills = candidateSkills.filter((skill) =>
            jobRequiredSkills.some((req) => req.includes(skill.toLowerCase()))
          );

          // Calculate percentage match
          matchScore = Math.min(
            100,
            Math.round((matchingSkills.length / jobRequiredSkills.length) * 100)
          );
        }

        return {
          id: application.id,
          applicationId: application.id,
          jobId: application.job.id,
          jobTitle: application.job.title,
          user: application.user,
          profile: application.user.profile,
          status: application.status,
          appliedDate: application.appliedDate,
          matchScore: matchScore,
          coverLetter: application.coverLetter,
        };
      });

      res.json(candidates);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a specific candidate's application details
   */
  static async getCandidateById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const candidateId = req.params.id; // This is actually the application ID
      const employerId = req.body.userId;
      const userRole = req.body.userRole;

      // Ensure the user is an employer
      if (userRole !== 'employer') {
        res
          .status(403)
          .json({ error: 'Unauthorized: Only employers can view candidates' });
        return;
      }

      // Find the application
      const application = await AppDataSource.getRepository(Application)
        .createQueryBuilder('application')
        .leftJoinAndSelect('application.job', 'job')
        .leftJoinAndSelect('application.user', 'user')
        .leftJoinAndSelect('user.profile', 'profile')
        .where('application.id = :candidateId', { candidateId })
        .andWhere('job.postedBy = :employerId', { employerId })
        .getOne();

      if (!application) {
        res
          .status(404)
          .json({ error: 'Candidate not found or you do not have access' });
        return;
      }

      // Remove sensitive information
      if (application.user) {
        const { passwordHash, ...userWithoutPassword } = application.user;
        application.user = userWithoutPassword as User;
      }

      // Calculate match score (same as in getAllCandidates)
      let matchScore = 0;
      if (application.user.profile?.skills && application.job.requiredSkills) {
        const candidateSkills = application.user.profile.skills;
        const jobRequiredSkills = application.job.requiredSkills.map((skill) =>
          skill.trim().toLowerCase()
        );

        const matchingSkills = candidateSkills.filter((skill) =>
          jobRequiredSkills.some((req) => req.includes(skill.toLowerCase()))
        );

        matchScore = Math.min(
          100,
          Math.round((matchingSkills.length / jobRequiredSkills.length) * 100)
        );
      }

      // Format response
      const candidateDetails = {
        id: application.id,
        applicationId: application.id,
        jobId: application.job.id,
        jobTitle: application.job.title,
        user: application.user,
        profile: application.user.profile,
        status: application.status,
        appliedDate: application.appliedDate,
        matchScore: matchScore,
        coverLetter: application.coverLetter,
      };

      res.json(candidateDetails);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update candidate application status
   */
  static async updateCandidateStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const candidateId = req.params.id; // Application ID
      const { status } = req.body;
      const employerId = req.body.userId;
      const userRole = req.body.userRole;

      // Ensure the user is an employer
      if (userRole !== 'employer') {
        res
          .status(403)
          .json({
            error: 'Unauthorized: Only employers can update candidate status',
          });
        return;
      }

      // Validate status value
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

      // Find the application
      const application = await AppDataSource.getRepository(Application)
        .createQueryBuilder('application')
        .leftJoinAndSelect('application.job', 'job')
        .where('application.id = :candidateId', { candidateId })
        .andWhere('job.postedBy = :employerId', { employerId })
        .getOne();

      if (!application) {
        res
          .status(404)
          .json({ error: 'Candidate not found or you do not have access' });
        return;
      }

      // Update status
      application.status = status as ApplicationStatus;
      await AppDataSource.getRepository(Application).save(application);

      res.json({
        id: application.id,
        status: application.status,
        message: 'Candidate status updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get candidates statistics for an employer
   * This provides an overview of application status for all jobs
   */
  static async getCandidatesStats(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const employerId = req.body.userId;
      const userRole = req.body.userRole;

      // Ensure the user is an employer
      if (userRole !== 'employer') {
        res
          .status(403)
          .json({
            error: 'Unauthorized: Only employers can view candidate statistics',
          });
        return;
      }

      // Get all jobs posted by the employer
      const jobs = await AppDataSource.getRepository(Job).find({
        where: { postedBy: { id: employerId } },
        select: ['id', 'title'],
      });

      const jobIds = jobs.map((job) => job.id);

      if (jobIds.length === 0) {
        res.json({
          totalCandidates: 0,
          jobStats: [],
          statusStats: {
            pending: 0,
            reviewing: 0,
            interviewed: 0,
            accepted: 0,
            rejected: 0,
          },
        });
        return;
      }

      // Get application stats
      const applicationRepository = AppDataSource.getRepository(Application);

      // Total candidates
      const totalCandidates = await applicationRepository
        .createQueryBuilder('application')
        .leftJoin('application.job', 'job')
        .where('job.postedBy = :employerId', { employerId })
        .getCount();

      // Status distribution
      const statusStats: Record<string, number> = {
        pending: 0,
        reviewing: 0,
        interviewed: 0,
        accepted: 0,
        rejected: 0,
      };

      const statusCounts = await applicationRepository
        .createQueryBuilder('application')
        .leftJoin('application.job', 'job')
        .select('application.status', 'status')
        .addSelect('COUNT(*)', 'count')
        .where('job.postedBy = :employerId', { employerId })
        .groupBy('application.status')
        .getRawMany();

      statusCounts.forEach((stat) => {
        const status = stat.status;
        if (status in statusStats) {
          statusStats[status] = parseInt(stat.count);
        }
      });

      // Stats per job
      const jobStats = await Promise.all(
        jobs.map(async (job) => {
          const count = await applicationRepository
            .createQueryBuilder('application')
            .where('application.job = :jobId', { jobId: job.id })
            .getCount();

          return {
            jobId: job.id,
            jobTitle: job.title,
            applicantCount: count,
          };
        })
      );

      res.json({
        totalCandidates,
        jobStats,
        statusStats,
      });
    } catch (error) {
      next(error);
    }
  }
}
