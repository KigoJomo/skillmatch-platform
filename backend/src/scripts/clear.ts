import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { Profile } from '../entities/Profile';
import { Job } from '../entities/Job';
import { JobApplication } from '../entities/JobApplication';
import { Project } from '../entities/Project';
import { JobMatch } from '../entities/JobMatch';

async function clearDatabase() {
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
  try {
    await jobMatchRepository.delete({});
    console.log('JobMatch table cleared.');
    await jobApplicationRepository.delete({});
    console.log('JobApplication table cleared.');
    await projectRepository.delete({});
    console.log('Project table cleared.');
    await jobRepository.delete({});
    console.log('Job table cleared.');
    await profileRepository.delete({});
    console.log('Profile table cleared.');
    await userRepository.delete({});
    console.log('User table cleared.');
    console.log('All specified tables cleared successfully.');
  } catch (error) {
    console.error('Error clearing database:', error);
  } finally {
    await AppDataSource.destroy();
    console.log('Database connection closed.');
  }
}

clearDatabase().catch((error) => {
  console.error('Database clearing failed:', error);
  process.exit(1);
});
