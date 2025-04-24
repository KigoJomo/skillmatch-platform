import { Request, Response } from 'express';
import { Job } from '../entities/Job';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { JobApplication } from '../entities/JobApplication';
import { AuthRequest } from '../middleware/auth.middleware';

const jobRepository = AppDataSource.getRepository(Job);
const userRepository = AppDataSource.getRepository(User);
const applicationRepository = AppDataSource.getRepository(JobApplication);

export class JobController {
  // Create a new job posting
  static async createJob(req: AuthRequest, res: Response) {
    try {
      const recruiterId = req.user?.id;
      if (!recruiterId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const recruiter = await userRepository.findOne({
        where: { id: recruiterId },
      });
      if (!recruiter || recruiter.role !== 'Employer/Recruiter') {
        res
          .status(403)
          .json({ error: 'Only recruiters can create job postings' });
        return;
      }

      const jobData = { ...req.body, recruiter };
      const job = jobRepository.create(jobData);
      await jobRepository.save(job);

      res.status(201).json(job);
    } catch (error) {
      console.error('Create job error:', error);
      res.status(500).json({ error: 'Failed to create job posting' });
    }
  }

  // Get all jobs for a recruiter
  static async getRecruiterJobs(req: AuthRequest, res: Response) {
    try {
      const recruiterId = req.user?.id;
      if (!recruiterId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const jobs = await jobRepository.find({
        where: { recruiter: { id: recruiterId } },
        relations: ['applications'],
        order: { createdAt: 'DESC' },
      });

      const jobsWithStats = jobs.map((job) => ({
        ...job,
        applicantCount: job.applications.length,
        applications: undefined, // Don't send full application data in list view
      }));

      res.json(jobsWithStats);
    } catch (error) {
      console.error('Get recruiter jobs error:', error);
      res.status(500).json({ error: 'Failed to fetch job postings' });
    }
  }

  // Get a specific job with applications
  static async getJobDetails(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const recruiterId = req.user?.id;

      const job = await jobRepository.findOne({
        where: { id, recruiter: { id: recruiterId } },
        relations: [
          'applications',
          'applications.applicant',
          'applications.applicant.profile',
        ],
      });

      if (!job) {
        res.status(404).json({ error: 'Job not found' });
        return;
      }

      res.json(job);
    } catch (error) {
      console.error('Get job details error:', error);
      res.status(500).json({ error: 'Failed to fetch job details' });
    }
  }

  // Update a job posting
  static async updateJob(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const recruiterId = req.user?.id;

      const job = await jobRepository.findOne({
        where: { id, recruiter: { id: recruiterId } },
      });

      if (!job) {
        res.status(404).json({ error: 'Job not found' });
        return;
      }

      const updatedJob = await jobRepository.save({
        ...job,
        ...req.body,
        id, // Ensure ID doesn't change
      });

      res.json(updatedJob);
    } catch (error) {
      console.error('Update job error:', error);
      res.status(500).json({ error: 'Failed to update job posting' });
    }
  }

  // Delete a job posting
  static async deleteJob(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const recruiterId = req.user?.id;

      const job = await jobRepository.findOne({
        where: { id, recruiter: { id: recruiterId } },
      });

      if (!job) {
        res.status(404).json({ error: 'Job not found' });
        return;
      }

      await jobRepository.remove(job);
      res.status(204).send();
    } catch (error) {
      console.error('Delete job error:', error);
      res.status(500).json({ error: 'Failed to delete job posting' });
    }
  }

  // Handle job status changes (e.g., draft -> active -> closed)
  static async updateJobStatus(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const recruiterId = req.user?.id;

      const job = await jobRepository.findOne({
        where: { id, recruiter: { id: recruiterId } },
      });

      if (!job) {
        res.status(404).json({ error: 'Job not found' });
        return;
      }

      if (!['draft', 'active', 'closed'].includes(status)) {
        res.status(400).json({ error: 'Invalid status' });
        return;
      }

      job.status = status;
      await jobRepository.save(job);

      res.json(job);
    } catch (error) {
      console.error('Update job status error:', error);
      res.status(500).json({ error: 'Failed to update job status' });
    }
  }

  // Apply for a job
  static async applyForJob(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { coverLetter } = req.body;
      const userId = req.user?.id;

      const job = await jobRepository.findOne({
        where: { id },
      });

      if (!job) {
        res.status(404).json({ error: 'Job not found' });
        return;
      }

      const applicant = await userRepository.findOne({
        where: { id: userId },
        relations: ['profile'],
      });

      if (!applicant) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // Helper function to ensure we have an array of skills
      const ensureSkillsArray = (
        skills: string | string[] | undefined
      ): string[] => {
        if (!skills) return [];
        if (typeof skills === 'string')
          return skills.split(',').map((s) => s.trim());
        return skills;
      };

      // Helper function to normalize skills
      const normalizeSkill = (skill: string): string => {
        return skill
          .toLowerCase()
          .trim()
          .replace(/[-_. ]+/g, ' ');
      };

      // Calculate match percentage
      let matchPercentage = 0;
      if (applicant.profile?.skills && job.requiredSkills) {
        const normalizedUserSkills = ensureSkillsArray(
          applicant.profile.skills
        ).map(normalizeSkill);
        const normalizedJobSkills = ensureSkillsArray(job.requiredSkills).map(
          normalizeSkill
        );

        const matchingSkills = normalizedJobSkills.filter((jobSkill) =>
          normalizedUserSkills.some((userSkill) => userSkill === jobSkill)
        );
        matchPercentage = Math.round(
          (matchingSkills.length / normalizedJobSkills.length) * 100
        );
      }

      const application = applicationRepository.create({
        applicant,
        job,
        coverLetter,
        matchPercentage,
        status: 'Pending',
      });

      await applicationRepository.save(application);
      res.status(201).json(application);
    } catch (error) {
      console.error('Apply for job error:', error);
      res.status(500).json({ error: 'Failed to apply for job' });
    }
  }

  // Get applications for a specific job
  static async getJobApplications(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const recruiterId = req.user?.id;

      const applications = await applicationRepository.find({
        where: { job: { id, recruiter: { id: recruiterId } } },
        relations: ['applicant', 'applicant.profile', 'job'],
        order: { appliedAt: 'DESC' },
      });

      console.log(
        'Raw applications from DB:',
        applications.map((app) => ({
          id: app.id,
          matchPercentage: app.matchPercentage,
        }))
      );

      const formattedApplications = applications.map((app) => {
        const formatted = {
          id: app.id,
          applicant: {
            id: app.applicant.id,
            profile: app.applicant.profile,
            email: app.applicant.email,
          },
          job: {
            id: app.job.id,
            title: app.job.title,
            requiredSkills: app.job.requiredSkills,
          },
          coverLetter: app.coverLetter,
          status: app.status,
          appliedAt: app.appliedAt,
          matchPercentage: app.matchPercentage,
        };
        console.log(
          'Formatted application:',
          app.id,
          formatted.matchPercentage
        );
        return formatted;
      });

      res.json(formattedApplications);
    } catch (error) {
      console.error('Get job applications error:', error);
      res.status(500).json({ error: 'Failed to fetch applications' });
    }
  }

  // Update application status
  static async updateApplicationStatus(req: AuthRequest, res: Response) {
    try {
      const { jobId, applicationId } = req.params;
      const { status } = req.body;
      const recruiterId = req.user?.id;

      const application = await applicationRepository.findOne({
        where: {
          id: applicationId,
          job: { id: jobId, recruiter: { id: recruiterId } },
        },
        relations: ['job'],
      });

      if (!application) {
        res.status(404).json({ error: 'Application not found' });
        return;
      }

      if (!['Pending', 'Accepted', 'Rejected'].includes(status)) {
        res.status(400).json({ error: 'Invalid status' });
        return;
      }

      application.status = status;
      await applicationRepository.save(application);

      res.json(application);
    } catch (error) {
      console.error('Update application status error:', error);
      res.status(500).json({ error: 'Failed to update application status' });
    }
  }
}
