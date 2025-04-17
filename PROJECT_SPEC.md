# SkillMatch Project Specification

## Project Overview

SkillMatch is a modern job matching platform that connects job seekers with employers using AI-driven matching algorithms. The platform emphasizes skill-based matching over traditional resume scanning.

## Technical Stack

### Frontend

- **Framework**: Angular (Latest)
- **Styling**: TailwindCSS
- **State Management**: RxJS
- **Build & Deploy**:
  - GitHub Actions for CI/CD
  - AWS S3 for static hosting
  - CloudFront for CDN (recommended)

### Backend

- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL via Neon.tech
  - Serverless PostgreSQL
  - Auto-scaling
  - Point-in-time recovery
  - Branch creation for development
- **ORM**: TypeORM
- **Authentication**: JWT with Email/Password
- **AI**: Google's Gemini for chat assistance
- **Deployment**:
  - Docker containerization
  - AWS ECS/EKS (recommended)
  - GitHub Actions for CI/CD

## Core Features

### 1. Authentication & User Management

- Email/Password authentication
- JWT-based session management
- Role-based access control
- Secure password handling with bcrypt
- OAuth integration (future)

### 2. Profile Management

- **Job Seekers**:

  - Personal info & contact details
  - Skills inventory
  - Experience levels
  - Portfolio/Projects
  - Resume upload
  - Preferred job types
  - Location preferences
  - Salary expectations

- **Employers**:
  - Company profile
  - Industry sector
  - Company size
  - Location
  - Hiring preferences
  - Interview process details
  - Benefits offered

### 3. Job Management

- **For Employers**:

  - Post new jobs
  - Manage job listings
  - Set requirements & qualifications
  - Define job types (Full-time, Part-time, Contract, etc.)
  - Specify remote/onsite preferences

- **For Job Seekers**:
  - Browse jobs
  - AI-powered job recommendations
  - Apply to positions
  - Track application status
  - Save favorite jobs

### 4. Application Process

- **Statuses**: Pending, Reviewing, Interviewed, Accepted, Rejected, Withdrawn
- Cover letter submission
- Resume attachment
- Application tracking
- Match score calculation
- Two-way status updates

### 5. AI Features

- AI Chat Assistant (Gemini)
  - Query job database and provide insights
  - Career guidance based on skills
  - Job search strategy recommendations
  - Interview preparation tips
  - Industry insights and trends
  - Resume and profile optimization suggestions
- Skill matching algorithm
- Job recommendation engine
- Match score calculation
- Candidate ranking

### 6. Dashboard & Analytics

- **For Job Seekers**:

  - Application status tracking
  - Job recommendations
  - Profile completion metrics
  - Application statistics

- **For Employers**:
  - Candidate pipeline
  - Hiring metrics
  - Application analytics
  - Posting performance

## Database Schema

### Users Table

- id (UUID)
- name (string)
- email (string, unique)
- passwordHash (string)
- role (enum: 'Job Seeker', 'Employer/Recruiter')
- createdAt (timestamp)
- updatedAt (timestamp)

### Profiles Table

- id (UUID)
- userId (UUID, FK)
- bio (text)
- phone (string)
- skills (text[])
- experienceLevel (string)
- jobTypes (text[])
- salaryExpectation (string)
- preferredLocation (string)
- location (string)
- experience (jsonb)
- education (string)
- avatarUrl (string)
- resumeUrl (string)
- linkedIn (string)
- github (string)
- website (string)
- companyName (string)
- companySize (string)
- industry (string)
- description (text)
- workLocations (string)
- interviewProcess (text)
- benefits (text)
- salaryRange (string)
- onboardingCompleted (boolean)

### Jobs Table

- id (UUID)
- title (string)
- description (text)
- company (string)
- location (string)
- salary (string)
- jobType (enum)
- experienceLevel (enum)
- requiredSkills (text[])
- isActive (boolean)
- postedDate (timestamp)
- postedById (UUID, FK)
- createdAt (timestamp)
- updatedAt (timestamp)

### Applications Table

- id (UUID)
- jobId (UUID, FK)
- userId (UUID, FK)
- coverLetter (text)
- resumeUrl (string)
- answers (jsonb)
- matchScore (float)
- status (enum)
- appliedDate (timestamp)
- updatedAt (timestamp)

### AI_Chat_Sessions Table

- id (UUID)
- userId (UUID, FK)
- sessionStart (timestamp)
- sessionEnd (timestamp)
- context (jsonb)
- createdAt (timestamp)
- updatedAt (timestamp)

### AI_Chat_Messages Table

- id (UUID)
- sessionId (UUID, FK)
- role (enum: 'user', 'assistant')
- content (text)
- timestamp (timestamp)
- metadata (jsonb)
- relevantData (jsonb)

## API Endpoints

### Authentication

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/users/:id

### Profile

- GET /api/profile
- POST /api/profile
- PUT /api/profile
- PATCH /api/profile/onboarding
- POST /api/profile/onboarding
- POST /api/profile/resume
- POST /api/profile/avatar
- GET /api/profile/:id

### Jobs

- GET /api/jobs
- POST /api/jobs
- GET /api/jobs/:id
- PUT /api/jobs/:id
- DELETE /api/jobs/:id

### Applications

- GET /api/applications
- POST /api/applications
- GET /api/applications/:id
- PATCH /api/applications/:id/status
- DELETE /api/applications/:id

### Candidates

- GET /api/candidates
- GET /api/candidates/stats
- GET /api/candidates/:id
- PATCH /api/candidates/:id/status

### AI Chat

- GET /api/chat/sessions
- POST /api/chat/sessions
- GET /api/chat/sessions/:id
- POST /api/chat/sessions/:id/messages
- GET /api/chat/sessions/:id/messages

## Environment Configuration

### Frontend (.env)

```
VITE_API_URL=http://localhost:4000
VITE_AWS_REGION=your-region
VITE_AWS_BUCKET=your-bucket
VITE_THEME=light
```

### Backend (.env)

```
# Database Configuration (Neon)
DATABASE_URL=postgres://user:pass@ep-something.region.aws.neon.tech/dbname?sslmode=require
NEON_PROJECT_ID=your-project-id

# Authentication
JWT_SECRET=your-super-secret-key
TOKEN_EXPIRY=7d

# Server Configuration
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:4200

# AI Configuration
GEMINI_API_KEY=your-gemini-api-key
```

## Infrastructure (AWS)

### Frontend

- S3 Bucket for static hosting
- CloudFront distribution
- Route53 DNS configuration
- ACM SSL certificate

### Backend

- ECS/EKS cluster
- Application Load Balancer
- RDS PostgreSQL (or Neon)
- ElastiCache (optional, for caching)
- S3 bucket for file uploads

## CI/CD Pipelines

### Frontend Pipeline

1. Build Angular application
2. Run unit tests
3. Run e2e tests
4. Build production assets
5. Deploy to S3
6. Invalidate CloudFront cache

### Backend Pipeline

1. Run tests
2. Build Docker image
3. Push to ECR
4. Deploy to ECS/EKS

## Development Guidelines

### Code Style

- Follow Angular style guide
- Use TypeScript strict mode
- Implement proper error handling
- Write unit tests for critical components
- Document API endpoints with JSDoc
- Use meaningful commit messages

### Security Measures

- Implement rate limiting
- Use CORS properly
- Validate all inputs
- Sanitize database queries
- Implement proper access control
- Use secure headers (helmet)
- Regular dependency updates

### Performance Considerations

- Implement proper caching
- Optimize database queries
- Use lazy loading for routes
- Optimize images and assets
- Implement pagination
- Monitor API response times

## Monitoring & Analytics

- Application performance monitoring
- Error tracking
- User analytics
- Server metrics
- Database performance
- API usage statistics

## Future Enhancements

1. OAuth integration (Google, GitHub, LinkedIn)
2. Real-time chat between employers and candidates
3. Enhanced AI features for better matching
4. Mobile applications
5. Integration with job boards
6. Advanced analytics dashboard
7. Automated interview scheduling
8. Skills assessment tests
9. Video interview integration
10. Blockchain-verified credentials

## Support & Documentation

- API documentation
- User guides
- Development setup guide
- Deployment procedures
- Troubleshooting guide
- Security guidelines
