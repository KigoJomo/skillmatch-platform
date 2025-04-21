export type UserRole = 'Job Seeker' | 'Employer/Recruiter';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Profile {
  id: string;
  user: User;
  firstName?: string;
  lastName?: string;
  phone?: string;
  skills?: string[];
  experienceLevel?: string;
  jobTypes?: string[];
  bio?: string;
  location?: string;
  description?: string;
  website?: string;
  interviewProcess?: string;
  benefits?: string;
  workLocations?: string;
  companySize?: string;
  industry?: string;
  salaryRange?: string;
  salaryExpectation?: string;
  preferredLocation?: string;
  projects?: Project[];
}

export interface Job {
  id: string;
  title: string;
  description: string;
  department: string;
  location: string;
  experienceLevel: string;
  educationRequirements: string;
  employmentType: string;
  salaryRange: string;
  benefits: string;
  workingHours: string;
  requiredSkills: string[];
  status: 'draft' | 'active' | 'closed';
  recruiter: User;
  applications: JobApplication[];
  createdAt: string;
  updatedAt: string;
}

export interface JobListing extends Job {
  matchPercentage: number;
  company: string;
}

export interface JobApplication {
  id: string;
  applicant: User & {
    profile: Profile;
  };
  job: Job;
  coverLetter: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  appliedAt: string;
  updatedAt: string;
  matchPercentage: number;
}

export interface DashboardData {
  matchCount: number;
  applicationCount: number;
  rejectedCount: number;
  recentActivity: JobApplication[];
}

export interface Project {
  id?: string;
  name: string;
  description: string;
  url?: string;
  skillsUsed?: string[];
  createdAt: string;
  updatedAt: string;
}
