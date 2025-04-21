import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Profile } from '../entities/Profile';
import { AuthRequest } from '../middleware/auth.middleware';
import { JobApplication } from '../entities/JobApplication';
import { JobMatch } from '../entities/JobMatch';
import { Job } from '../entities/Job';

const profileRepository = AppDataSource.getRepository(Profile);
const jobRepository = AppDataSource.getRepository(Job);
const jobApplicationRepository = AppDataSource.getRepository(JobApplication);
const jobMatchRepository = AppDataSource.getRepository(JobMatch);

export class DashbboardController {
  static async getJobSeekerDashboard(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;

      const matchCount = await jobMatchRepository.count({
        where: {
          jobSeeker: { id: userId },
        },
      });

      const applicationCount = await jobApplicationRepository.count({
        where: {
          applicant: { id: userId },
        },
      });

      const rejectedCount = await jobApplicationRepository.count({
        where: { applicant: { id: userId }, status: 'Rejected' },
      });

      const recentActivity = await jobApplicationRepository.find({
        where: { applicant: { id: userId } },
        order: { appliedAt: 'DESC' },
        take: 5,
      });

      res.json({
        matchCount,
        applicationCount,
        rejectedCount,
        recentActivity,
      });
    } catch (error) {
      console.error('Dashboard data error:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
  }

  static async getAvailableJobs(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;

      // Get user profile with skills
      const userProfile = await profileRepository.findOne({
        where: { user: { id: userId } },
      });

      // Get all jobs
      const jobs = await jobRepository.find({
        relations: ['recruiter', 'recruiter.profile'],
      });

      // Calculate match percentage for each job
      const jobsWithMatch = await Promise.all(
        jobs.map(async (job) => {
          let matchPercentage = 0;
          if (userProfile?.skills && job.requiredSkills) {
            const matchingSkills = job.requiredSkills.filter((skill) =>
              userProfile.skills?.includes(skill)
            );
            matchPercentage = Math.round(
              (matchingSkills.length / job.requiredSkills.length) * 100
            );

            // Create job match if above threshold and doesn't exist
            if (matchPercentage >= 70) {
              try {
                const existingMatch = await jobMatchRepository.findOne({
                  where: {
                    jobSeeker: { id: userId },
                    job: { id: job.id },
                  },
                });

                if (!existingMatch) {
                  await jobMatchRepository.save({
                    jobSeeker: { id: userId },
                    job: { id: job.id },
                  });
                }
              } catch (error) {
                console.error('Error creating job match:', error);
              }
            }
          }
          return {
            ...job,
            matchPercentage,
            company: job.recruiter.profile?.firstName || 'Unknown Company',
          };
        })
      );

      res.json(jobsWithMatch);
    } catch (error) {
      console.error('Get available jobs error:', error);
      res.status(500).json({ error: 'Failed to fetch available jobs' });
    }
  }

  static async getSeekerApplications(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;

      const applications = await jobApplicationRepository.find({
        where: { applicant: { id: userId } },
        relations: ['job', 'job.recruiter', 'job.recruiter.profile'],
        order: { appliedAt: 'DESC' },
      });

      const formattedApplications = applications.map((app) => ({
        id: app.id,
        jobTitle: app.job.title,
        company: app.job.recruiter.profile?.firstName || 'Unknown Company',
        location: app.job.location,
        appliedDate: app.appliedAt,
        status: app.status,
        statusClass: getStatusClass(app.status),
        nextSteps: getNextSteps(app.status),
        hasMessage: app.status === 'Accepted' || app.status === 'Rejected',
      }));

      res.json(formattedApplications);
    } catch (error) {
      console.error('Get seeker applications error:', error);
      res.status(500).json({ error: 'Failed to fetch applications' });
    }
  }
}

function getStatusClass(status: string): string {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-500/20 text-yellow-500';
    case 'Accepted':
      return 'bg-green-500/20 text-green-500';
    case 'Rejected':
      return 'bg-red-500/20 text-red-500';
    default:
      return 'bg-blue-500/20 text-blue-500';
  }
}

function getNextSteps(status: string): string {
  switch (status) {
    case 'Pending':
      return 'Application under review';
    case 'Accepted':
      return 'Congratulations! The employer will contact you soon.';
    case 'Rejected':
      return 'Thank you for your interest';
    default:
      return 'Application is being processed';
  }
}
