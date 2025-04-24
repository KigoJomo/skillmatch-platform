import { Response } from 'express';
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

export class DashboardController {
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
        relations: ['job'],
        order: { appliedAt: 'DESC' },
        take: 5,
      });

      // Transform recent activity to match the interface
      const transformedActivity = recentActivity.map((activity) => ({
        job: {
          title: activity.job.title,
          requiredSkills: activity.job.requiredSkills || [],
        },
        status: activity.status,
        appliedAt: activity.appliedAt,
      }));

      res.json({
        matchCount,
        applicationCount,
        rejectedCount,
        recentActivity: transformedActivity,
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

  static async getEmployerDashboard(req: AuthRequest, res: Response) {
    try {
      const recruiterId = req.user?.id;
      if (!recruiterId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Get counts for various metrics
      const [postedJobsCount, totalApplications, totalHires] =
        await Promise.all([
          jobRepository.count({
            where: { recruiter: { id: recruiterId } },
          }),
          jobApplicationRepository.count({
            where: { job: { recruiter: { id: recruiterId } } },
          }),
          jobApplicationRepository.count({
            where: {
              job: { recruiter: { id: recruiterId } },
              status: 'Accepted',
            },
          }),
        ]);

      // Get recent activity - latest applications
      const recentApplications = await jobApplicationRepository.find({
        where: { job: { recruiter: { id: recruiterId } } },
        relations: ['applicant', 'applicant.profile', 'job'],
        order: { appliedAt: 'DESC' },
        take: 5,
      });

      // Calculate hiring activity by month (last 3 months)
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      const hiringActivity = await jobApplicationRepository
        .createQueryBuilder('application')
        .select('COUNT(*)', 'count')
        .addSelect("DATE_TRUNC('month', application.appliedAt)", 'month')
        .where('application.appliedAt >= :date', { date: threeMonthsAgo })
        .andWhere('application.status = :status', { status: 'Accepted' })
        .groupBy('month')
        .getRawMany();

      // Get open positions with application stats
      const openPositions = await jobRepository.find({
        where: {
          recruiter: { id: recruiterId },
          status: 'active',
        },
        relations: ['applications'],
        take: 5,
      });

      const dashboardData = {
        metrics: {
          postedJobs: postedJobsCount,
          totalApplications,
          totalHires,
          activeJobs: openPositions.length,
        },
        recentActivity: recentApplications.map((app) => ({
          id: app.id,
          candidateName: `${app.applicant.profile.firstName} ${app.applicant.profile.lastName}`,
          jobTitle: app.job.title,
          status: app.status,
          date: app.appliedAt,
        })),
        hiringActivity,
        openPositions: openPositions.map((job) => ({
          id: job.id,
          title: job.title,
          applicantCount: job.applications.length,
          department: job.department,
          postedDate: job.createdAt,
        })),
      };

      res.json(dashboardData);
    } catch (error) {
      console.error('Get employer dashboard error:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
  }

  static async getEmployerAnalytics(req: AuthRequest, res: Response) {
    try {
      const recruiterId = req.user?.id;
      if (!recruiterId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Get application funnel data
      const applicationStats = await jobApplicationRepository
        .createQueryBuilder('application')
        .select('application.status', 'status')
        .addSelect('COUNT(*)', 'count')
        .leftJoin('application.job', 'job')
        .leftJoin('job.recruiter', 'recruiter')
        .where('recruiter.id = :recruiterId', { recruiterId })
        .groupBy('application.status')
        .getRawMany();

      // Get top required skills across all jobs
      const jobs = await jobRepository.find({
        where: { recruiter: { id: recruiterId } },
        select: ['requiredSkills'],
      });

      const skillsCount = jobs.reduce((acc, job) => {
        job.requiredSkills.forEach((skill) => {
          acc[skill] = (acc[skill] || 0) + 1;
        });
        return acc;
      }, {} as Record<string, number>);

      const topSkills = Object.entries(skillsCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([skill, count]) => ({ skill, count }));

      // Get hiring efficiency metrics
      // Fetch accepted applications for the recruiter
      const acceptedApplications = await jobApplicationRepository.find({
        where: {
          status: 'Accepted',
          job: { recruiter: { id: recruiterId } }, // TypeORM handles nested relations in where clauses
        },
        relations: ['job', 'job.recruiter'], // Ensure relations are loaded if needed for filtering
        select: {
          // Select only necessary fields for calculation
          id: true, // Include id or another primary key field
          appliedAt: true,
          updatedAt: true,
          job: {
            // Include relation structure needed for the where clause
            id: true,
            recruiter: {
              id: true,
            },
          },
        },
      });

      let averageDifferenceInDays = 0;
      if (acceptedApplications.length > 0) {
        const timeDifferencesInMs = acceptedApplications.map(
          (app) => app.updatedAt.getTime() - app.appliedAt.getTime()
        );
        const totalDifferenceInMs = timeDifferencesInMs.reduce(
          (sum, diff) => sum + diff,
          0
        );
        const averageDifferenceInMs =
          totalDifferenceInMs / acceptedApplications.length;
        // Convert milliseconds to days
        averageDifferenceInDays = averageDifferenceInMs / (1000 * 60 * 60 * 24);
      }

      // Structure the result similar to the original getRawOne() output
      // Ensure avgDays is a number, defaulting to 0 if no applications.
      const avgTimeToHire = {
        avgDays: averageDifferenceInDays > 0 ? averageDifferenceInDays : 0,
      };

      const analyticsData = {
        applicationFunnel: applicationStats,
        topRequiredSkills: topSkills,
        hiringMetrics: {
          averageTimeToHire: avgTimeToHire?.avgDays || 0,
          applicationSuccessRate:
            ((applicationStats.find((stat) => stat.status === 'Accepted')
              ?.count || 0) /
              (applicationStats.reduce(
                (sum, stat) => sum + Number(stat.count),
                0
              ) || 1)) *
            100,
        },
      };

      res.json(analyticsData);
    } catch (error) {
      console.error('Get employer analytics error:', error);
      res.status(500).json({ error: 'Failed to fetch analytics data' });
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
