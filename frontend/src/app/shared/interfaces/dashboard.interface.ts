export interface User {
  id: string;
  email: string;
  role: 'Job Seeker' | 'Employer/Recruiter';
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Profile {
  id: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  description?: string;
  website?: string;
  skills?: string[];
  experienceLevel?: string;
  jobTypes?: string[];
  bio?: string;
  location?: string;
  salaryExpectation?: string;
  preferredLocation?: string;
  companySize?: string;
  industry?: string;
  interviewProcess?: string;
  benefits?: string;
  workLocations?: string;
  salaryRange?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  salaryRange?: string;
  requiredSkills: string[];
  recruiter: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobListing extends Job{
  matchPercentage: number
  company: string
}

export interface JobApplication {
  id: string;
  applicant: User;
  job: Job;
  coverLetter: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  appliedAt: Date;
}

export interface DashboardData {
  matchCount: number;
  applicationCount: number;
  rejectedCount: number;
  recentActivity: JobApplication[];
}
