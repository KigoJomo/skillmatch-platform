import { faker } from '@faker-js/faker';
import { AppDataSource } from '../data-source';
import { User, UserRole } from '../entities/User';
import { Profile } from '../entities/Profile';
import { Job } from '../entities/Job';
import { JobApplication } from '../entities/JobApplication';
import { Project } from '../entities/Project';
import { JobMatch } from '../entities/JobMatch';
import { hash } from 'bcrypt'; // Import bcrypt hash function

const NUM_USERS = 500; // Total number of users (seekers + employers)
const NUM_EMPLOYERS_RATIO = 0.2; // 20% of users will be employers
const MAX_PROJECTS_PER_SEEKER = 7;
const MAX_JOBS_PER_EMPLOYER = 15;
const MAX_APPLICATIONS_PER_SEEKER = 20;
const MAX_MATCHES_PER_JOB = 30;
const SIX_MONTHS_AGO = new Date();
SIX_MONTHS_AGO.setMonth(SIX_MONTHS_AGO.getMonth() - 6);

async function seedDatabase() {
  await AppDataSource.initialize();
  console.log('Database connection initialized.');

  const userRepository = AppDataSource.getRepository(User);
  const profileRepository = AppDataSource.getRepository(Profile);
  const projectRepository = AppDataSource.getRepository(Project);
  const jobRepository = AppDataSource.getRepository(Job);
  const jobApplicationRepository = AppDataSource.getRepository(JobApplication);
  const jobMatchRepository = AppDataSource.getRepository(JobMatch);

  console.log('Clearing existing data...');
  // Order matters due to foreign key constraints
  await jobMatchRepository.delete({});
  await jobApplicationRepository.delete({});
  await projectRepository.delete({});
  await jobRepository.delete({});
  await profileRepository.delete({});
  await userRepository.delete({});
  console.log('Existing data cleared.');

  // Hash the fixed password once
  const fixedPassword = '1234567890';
  const passwordHash = await hash(fixedPassword, 10);
  console.log(`Using fixed password: ${fixedPassword} (Hashed)`);

  console.log(`Generating ${NUM_USERS} users...`);
  const users: User[] = [];
  const profiles: Profile[] = [];
  const projects: Project[] = [];
  const jobs: Job[] = [];
  const applications: JobApplication[] = [];
  const matches: JobMatch[] = [];

  for (let i = 0; i < NUM_USERS; i++) {
    const user = new User();
    user.email = faker.internet.email();
    user.passwordHash = passwordHash;
    user.role =
      Math.random() < NUM_EMPLOYERS_RATIO ? UserRole.EMPLOYER : UserRole.SEEKER;
    user.onboardingCompleted = true;
    user.createdAt = faker.date.between({
      from: SIX_MONTHS_AGO,
      to: new Date(),
    });
    user.updatedAt = faker.date.between({
      from: user.createdAt,
      to: new Date(),
    });
    users.push(user);

    const profile = new Profile();
    profile.user = user; // Link profile to user

    if (user.role === UserRole.EMPLOYER) {
      // Populate Employer/Company Profile
      profile.firstName = faker.company.name(); // Use company name for firstName
      profile.lastName = ''; // Leave lastName empty for companies
      profile.phone = faker.phone.number();
      profile.description =
        faker.company.catchPhrase() + '. ' + faker.lorem.paragraph();
      profile.website = faker.internet.url();
      profile.location =
        faker.location.city() +
        ', ' +
        faker.location.state({ abbreviated: true });
      profile.companySize = faker.helpers.arrayElement([
        '1-10',
        '11-50',
        '51-200',
        '201-500',
        '500+',
      ]);
      profile.industry = faker.commerce.department();
      profile.interviewProcess = faker.lorem.sentence(); // Add interview process
      profile.benefits = faker.lorem.sentence(); // Add benefits
      profile.workLocations = faker.helpers.arrayElement([
        'Remote',
        'On-site',
        'Hybrid',
      ]); // Add work locations
      // Leave seeker-specific fields null/empty
      profile.skills = [];
      profile.experienceLevel = '';
      profile.jobTypes = [];
      profile.bio = '';
      profile.salaryExpectation = '';
      profile.preferredLocation = '';
    } else {
      // Populate Seeker Profile (as before)
      profile.firstName = faker.person.firstName();
      profile.lastName = faker.person.lastName();
      profile.phone = faker.phone.number();
      profile.description = faker.lorem.paragraph();
      profile.website = faker.internet.url();
      profile.skills = faker.helpers.arrayElements(
        faker.definitions.commerce.department,
        faker.number.int({ min: 3, max: 10 })
      );
      profile.experienceLevel = faker.helpers.arrayElement([
        'Entry Level',
        'Mid Level',
        'Senior Level',
        'Lead',
        'Manager',
      ]);
      profile.jobTypes = faker.helpers.arrayElements(
        ['Full-time', 'Part-time', 'Contract', 'Internship'],
        faker.number.int({ min: 1, max: 3 })
      );
      profile.bio = faker.person.bio();
      profile.location =
        faker.location.city() +
        ', ' +
        faker.location.state({ abbreviated: true });
      profile.salaryExpectation = faker.finance.amount({
        min: 50000,
        max: 200000,
        dec: 0,
        symbol: '$',
      });
      profile.preferredLocation =
        faker.location.city() +
        ', ' +
        faker.location.state({ abbreviated: true });
      // Leave company-specific fields null/empty for seekers
      profile.companySize = '';
      profile.industry = '';
      profile.interviewProcess = '';
      profile.benefits = '';
      profile.workLocations = '';
    }
    profiles.push(profile);
  }
  // Save users first to get IDs
  await userRepository.save(users, { chunk: 100 }); // Save in chunks
  console.log(`${users.length} users created.`);
  // Now save profiles (which already have user references)
  await profileRepository.save(profiles, { chunk: 100 });
  console.log(`${profiles.length} profiles created.`);

  // Separate seekers and employers for easier processing
  const seekers = users.filter((u) => u.role === UserRole.SEEKER);
  const employers = users.filter((u) => u.role === UserRole.EMPLOYER);

  console.log(`Generating projects for ${seekers.length} seekers...`);
  for (const seeker of seekers) {
    const numProjects = faker.number.int({
      min: 0,
      max: MAX_PROJECTS_PER_SEEKER,
    });
    for (let j = 0; j < numProjects; j++) {
      const project = new Project();
      project.user = seeker;
      project.name = faker.commerce.productName() + ' Project';
      project.description = faker.lorem.sentences(3);
      project.url = faker.internet.url();
      // Find the profile associated with this seeker to get skills
      const seekerProfile = profiles.find((p) => p.user.id === seeker.id);
      project.skillsUsed = faker.helpers.arrayElements(
        seekerProfile?.skills || [],
        faker.number.int({ min: 1, max: 5 })
      );
      project.createdAt = faker.date.between({
        from: seeker.createdAt,
        to: new Date(),
      });
      project.updatedAt = faker.date.between({
        from: project.createdAt,
        to: new Date(),
      });
      projects.push(project);
    }
  }
  await projectRepository.save(projects, { chunk: 100 });
  console.log(`${projects.length} projects created.`);

  console.log(`Generating jobs for ${employers.length} employers...`);
  for (const employer of employers) {
    const numJobs = faker.number.int({ min: 1, max: MAX_JOBS_PER_EMPLOYER });
    for (let j = 0; j < numJobs; j++) {
      const job = new Job();
      job.recruiter = employer;
      job.title = faker.person.jobTitle();
      job.description = faker.lorem.paragraphs(3);
      job.location =
        faker.location.city() +
        ', ' +
        faker.location.state({ abbreviated: true });
      job.department = faker.commerce.department();
      job.employmentType = faker.helpers.arrayElement([
        'Full-time',
        'Part-time',
        'Contract',
      ]);
      const minSalary = faker.finance.amount({
        min: 60000,
        max: 250000,
        dec: 0,
        symbol: '$',
      });
      const maxSalary = faker.finance.amount({
        min: parseInt(minSalary.replace('$', ''), 10) + 10000,
        max: 300000,
        dec: 0,
        symbol: '$',
      }); // Ensure max > min
      job.salaryRange = `${minSalary} - ${maxSalary}`;
      job.experience = faker.helpers.arrayElement([
        '1-3 years',
        '3-5 years',
        '5+ years',
        'Entry Level',
      ]);
      job.education = faker.helpers.arrayElement([
        'High School',
        'Associate Degree',
        'Bachelor Degree',
        'Master Degree',
        'PhD',
      ]);
      job.benefits = faker.lorem.sentence();
      job.workingHours = faker.helpers.arrayElement([
        'Standard 9-5',
        'Flexible Hours',
        'Shift Work',
      ]);
      job.requiredSkills = faker.helpers.arrayElements(
        faker.definitions.commerce.department,
        faker.number.int({ min: 4, max: 12 })
      );
      job.status = faker.helpers.arrayElement(['active', 'draft', 'closed']);
      job.createdAt = faker.date.between({
        from: employer.createdAt,
        to: new Date(),
      });
      job.updatedAt = faker.date.between({
        from: job.createdAt,
        to: new Date(),
      });
      jobs.push(job);
    }
  }
  await jobRepository.save(jobs, { chunk: 100 });
  console.log(`${jobs.length} jobs created.`);

  // Fetch active jobs to create applications and matches for them
  const activeJobs = await jobRepository.find({ where: { status: 'active' } });
  console.log(
    `Found ${activeJobs.length} active jobs for applications/matches.`
  );

  if (activeJobs.length > 0 && seekers.length > 0) {
    console.log(`Generating applications for ${seekers.length} seekers...`);
    for (const seeker of seekers) {
      const numApplications = faker.number.int({
        min: 0,
        max: MAX_APPLICATIONS_PER_SEEKER,
      });
      const jobsToApply = faker.helpers.arrayElements(
        activeJobs,
        numApplications
      );
      for (const job of jobsToApply) {
        const application = new JobApplication();
        application.applicant = seeker;
        application.job = job;
        application.coverLetter = faker.lorem.paragraphs(2);
        application.status = faker.helpers.arrayElement([
          'Pending',
          'Accepted',
          'Rejected',
        ]);
        application.appliedAt = faker.date.between({
          from:
            job.createdAt > seeker.createdAt ? job.createdAt : seeker.createdAt,
          to: new Date(),
        });
        application.updatedAt = faker.date.between({
          from: application.appliedAt,
          to: new Date(),
        });
        // Calculate a simple match percentage based on shared skills
        const seekerProfile = profiles.find((p) => p.user.id === seeker.id);
        const commonSkills = (seekerProfile?.skills || []).filter((skill) =>
          job.requiredSkills.includes(skill)
        );
        application.matchPercentage =
          job.requiredSkills.length > 0
            ? (commonSkills.length / job.requiredSkills.length) * 100
            : 0;
        applications.push(application);
      }
    }
    await jobApplicationRepository.save(applications, { chunk: 100 });
    console.log(`${applications.length} job applications created.`);

    console.log(`Generating matches for ${activeJobs.length} active jobs...`);
    for (const job of activeJobs) {
      const numMatches = faker.number.int({ min: 0, max: MAX_MATCHES_PER_JOB });
      const seekersToMatch = faker.helpers.arrayElements(seekers, numMatches);
      for (const seeker of seekersToMatch) {
        // Avoid creating a match if an application already exists
        const existingApplication = applications.find(
          (app) => app.applicant.id === seeker.id && app.job.id === job.id
        );
        if (!existingApplication) {
          const match = new JobMatch();
          match.jobSeeker = seeker;
          match.job = job;
          match.matchedAt = faker.date.between({
            from:
              job.createdAt > seeker.createdAt
                ? job.createdAt
                : seeker.createdAt,
            to: new Date(),
          });
          matches.push(match);
        }
      }
    }
    await jobMatchRepository.save(matches, { chunk: 100 });
    console.log(`${matches.length} job matches created.`);
  } else {
    console.log(
      'Skipping application and match generation (no active jobs or no seekers).'
    );
  }

  await AppDataSource.destroy();
  console.log('Database connection closed.');
  console.log('Seeding finished successfully!');
}

seedDatabase().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
