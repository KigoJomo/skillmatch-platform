import { faker } from '@faker-js/faker';
import { AppDataSource } from '../data-source';
import { User, UserRole } from '../entities/User';
import { Profile } from '../entities/Profile';
import { Job } from '../entities/Job';
import { JobApplication } from '../entities/JobApplication';
import { Project } from '../entities/Project';
import { JobMatch } from '../entities/JobMatch';
import { hash } from 'bcrypt';

// Tech-focused seed data
const TECH_SKILLS = [
  // Programming Languages
  'TypeScript',
  'JavaScript',
  'Python',
  'Java',
  'C#',
  'Go',
  'Rust',
  'Ruby',
  'PHP',
  'Swift',
  'Kotlin',
  'Scala',
  'R',
  'Dart',
  // Frontend
  'React',
  'Angular',
  'Vue.js',
  'Next.js',
  'TailwindCSS',
  'HTML5',
  'CSS3',
  'Redux',
  'WebGL',
  'SASS/SCSS',
  'Svelte',
  'Accessibility/ARIA',
  'Remix',
  // Backend
  'Node.js',
  'Express.js',
  'NestJS',
  'Django',
  'Spring Boot',
  'ASP.NET Core',
  'GraphQL',
  'FastAPI',
  'Laravel',
  'Elixir/Phoenix',
  // Cloud & DevOps
  'AWS',
  'Azure',
  'GCP',
  'Docker',
  'Kubernetes',
  'Terraform',
  'Jenkins',
  'GitLab CI',
  'CircleCI',
  'Pulumi',
  'ArgoCD',
  // Databases
  'PostgreSQL',
  'MongoDB',
  'Redis',
  'MySQL',
  'Elasticsearch',
  'DynamoDB',
  'Cassandra',
  'Neo4j',
  'Supabase',
  'CockroachDB',
  // Mobile
  'React Native',
  'Flutter',
  'iOS',
  'Android',
  'Kotlin',
  'Swift UI',
  'Jetpack Compose',
  // Testing
  'Jest',
  'Cypress',
  'Selenium',
  'Playwright',
  'JUnit',
  'PyTest',
  'Testing Library',
  'Storybook',
  // AI/ML
  'TensorFlow',
  'PyTorch',
  'scikit-learn',
  'OpenAI API',
  'Hugging Face',
  'LangChain',
  'Computer Vision',
  'NLP',
  'MLOps',
  'LLM Fine-tuning',
  // Emerging Tech
  'Solidity',
  'Web3.js',
  'Smart Contracts',
  'AR/VR Development',
  'Unity 3D',
  'WebXR',
  'IoT Protocols',
  'MQTT',
  'Embedded Systems',
  'Quantum Computing',
  'Blockchain',
  // Security
  'Penetration Testing',
  'OWASP Security',
  'Cryptography',
  'Security Auditing',
  'Zero Trust Architecture',
  // Tools & Practices
  'Git',
  'Agile',
  'Scrum',
  'REST APIs',
  'Microservices',
  'CI/CD',
  'Observability',
  'Accessibility',
  'Internationalization',
];

const TECH_COMPANIES = [
  // US-based companies
  'TechForward Solutions',
  'CloudScale Systems',
  'DevMatrix',
  'DataPeak Technologies',
  'InnovateTech Labs',
  'ByteLogic Solutions',
  'CodeCraft Systems',
  'QuantumByte Technologies',
  'NeuraTech',
  'CyberPulse Solutions',
  'AgileStack Systems',
  'CloudNative Solutions',
  'DevOps Accelerator',
  'FullStack Dynamics',
  'AICore Systems',
  // Global tech companies
  'SustainaTech India',
  'Berlin Code Works',
  'Nairobi Dev Collective',
  'Tokyo AI Research',
  'Accessible Designs UK',
  'São Paulo Data Labs',
  'Green Computing APAC',
  'Nordic Blockchain Co-op',
  'EcoTech Africa',
  'Indigenous Tech Australia',
  'Dublin Analytics',
  'Seoul Mobile Innovations',
  'Tel Aviv Security Systems',
  'Paris Cloud Platforms',
  'Zurich IoT Solutions',
];

// Define the TechHub interface for proper typing
interface TechHub {
  city: string;
  region: string;
}

// Global tech hub locations with proper typing
const GLOBAL_TECH_HUBS: TechHub[] = [
  { city: 'San Francisco', region: 'CA' },
  { city: 'Seattle', region: 'WA' },
  { city: 'Austin', region: 'TX' },
  { city: 'New York', region: 'NY' },
  { city: 'Boston', region: 'MA' },
  { city: 'Bangalore', region: 'Karnataka, India' },
  { city: 'London', region: 'UK' },
  { city: 'Berlin', region: 'Germany' },
  { city: 'Singapore', region: 'Singapore' },
  { city: 'Tel Aviv', region: 'Israel' },
  { city: 'Toronto', region: 'Canada' },
  { city: 'Tokyo', region: 'Japan' },
  { city: 'São Paulo', region: 'Brazil' },
  { city: 'Nairobi', region: 'Kenya' },
  { city: 'Sydney', region: 'Australia' },
];

const TECH_DEPARTMENTS = [
  // Engineering Departments
  'Frontend Development',
  'Backend Development',
  'Full Stack Development',
  'DevOps & Infrastructure',
  'Cloud Engineering',
  'Mobile Development',
  'Data Engineering',
  'Machine Learning',
  'Quality Assurance',
  'Site Reliability Engineering',
  'Platform Engineering',
  'Security Engineering',
  'UI/UX Development',
  'API Development',
  // Non-Engineering Departments
  'Product Management',
  'UX/UI Design',
  'Technical Writing',
  'Developer Relations',
  'Technical Support',
  'Data Science',
  'Accessibility & Inclusion',
  'Localization & Internationalization',
  'Information Security',
  'Technical Project Management',
  'Customer Success Engineering',
  'AI Research',
  'Open Source Program Office',
];

const TECH_PROJECT_PREFIXES = [
  // Traditional projects
  'E-commerce Platform',
  'Real-time Analytics Dashboard',
  'API Gateway',
  'Mobile App',
  'Cloud Migration',
  'DevOps Pipeline',
  'Authentication System',
  'Data Processing Pipeline',
  'Recommendation Engine',
  'Monitoring Solution',
  'Microservices Architecture',
  'Progressive Web App',
  // Social impact and specialized projects
  'Accessibility Compliance Tool',
  'Language Learning Platform',
  'Carbon Footprint Calculator',
  'Healthcare Management System',
  'Blockchain Voting System',
  'VR Training Simulator',
  'Inclusive Design System',
  'Multi-language Support Framework',
  'Green Energy Tracker',
  'Disaster Management Platform',
  'Community Resource Mapper',
  'Assistive Technology Interface',
];

const TECH_JOB_REQUIREMENTS = {
  'Entry Level': [
    'Strong foundation in computer science fundamentals',
    'Basic understanding of web technologies',
    'Eagerness to learn and grow',
    'Good problem-solving skills',
    'Familiarity with version control (Git)',
    'Portfolio of personal or academic projects',
    'Bootcamp, self-taught, or CS background welcome',
    'Passion for technology and continuous learning',
  ],
  'Mid Level': [
    'Minimum 3 years of professional software development experience',
    'Strong expertise in relevant technology stack',
    'Experience with agile development practices',
    'Ability to mentor junior developers',
    'Track record of delivering complex features',
    'Experience with cross-functional collaboration',
    'Strong communication skills with technical and non-technical stakeholders',
    'Understanding of software best practices and design patterns',
  ],
  'Senior Level': [
    'Minimum 5 years of professional development experience',
    'Architecture and system design expertise',
    'Strong technical leadership abilities',
    'Experience with scalable systems',
    'Track record of mentoring teams',
    'Deep expertise in at least one technology domain',
    'Experience driving technical decisions',
    'Ability to translate business requirements into technical solutions',
  ],
  Lead: [
    'Minimum 7 years of professional development experience',
    'Experience leading technical teams',
    'Strong system architecture expertise',
    'Track record of successful project delivery',
    'Excellence in technical communication',
    'Ability to influence product roadmap from technical perspective',
    'Experience with strategic planning and execution',
    'Cross-team collaboration skills',
  ],
  Manager: [
    'Minimum 8 years of professional experience',
    'Strong people management skills',
    'Experience with project planning and execution',
    'Budget and resource management expertise',
    'Strategic thinking and planning abilities',
    'Experience with performance management and team growth',
    'Ability to bridge technical and business objectives',
    'Stakeholder management skills',
  ],
};

const TECH_BENEFITS = [
  // Standard benefits
  'Competitive salary with equity options',
  'Remote work flexibility with modern home office setup',
  'Comprehensive health, dental, and vision insurance',
  'Professional development budget and conference attendance',
  'Latest MacBook Pro or high-end dev machine',
  'Flexible working hours and unlimited PTO',
  'Regular team building and hackathons',
  'Monthly wellness and learning stipend',
  'Parental leave and childcare benefits',
  '401(k) matching and stock options',
  // Global and diverse benefits
  'International relocation support',
  'Language learning stipend',
  'Cultural exchange programs',
  'Mental health and therapy services',
  'Four-day workweek options',
  'Paid volunteer time off',
  'Carbon offset program for business travel',
  'Religious and cultural observance days',
  'Home office sustainability upgrade',
  'Family care support (children and elders)',
  'Fertility and adoption assistance',
  'Sabbatical program for long-term employees',
  'Co-working space allowance for remote workers',
  'Continuing education reimbursement',
  'Inclusive healthcare covering gender-affirming care',
];

const NUM_USERS = 1000; // Total number of users (seekers + employers)
const NUM_EMPLOYERS_RATIO = 0.2; // 20% of users will be employers
const MAX_PROJECTS_PER_SEEKER = 7;
const MAX_JOBS_PER_EMPLOYER = 15;
const MAX_APPLICATIONS_PER_SEEKER = 20;
const MAX_MATCHES_PER_JOB = 30;
const SIX_MONTHS_AGO = new Date();
SIX_MONTHS_AGO.setMonth(SIX_MONTHS_AGO.getMonth() - 12);

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
    // Generate lowercase tech-appropriate emails
    const firstName = faker.person.firstName().toLowerCase();
    const lastName = faker.person.lastName().toLowerCase();
    const emailDomain = faker.helpers.arrayElement([
      'gmail.com',
      'outlook.com',
      'yahoo.com',
      'hotmail.com',
    ]);
    user.email = `${firstName}.${lastName}${faker.number.int({
      min: 1,
      max: 99,
    })}@${emailDomain}`;
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
    profile.user = user;

    if (user.role === UserRole.EMPLOYER) {
      const companyName = faker.helpers.arrayElement(TECH_COMPANIES);
      profile.firstName = companyName;
      profile.lastName = '';
      profile.phone = faker.phone.number();
      // Generate realistic company descriptions
      const mission = faker.company.catchPhrase();
      const expertise = faker.helpers.arrayElements(TECH_SKILLS, 3).join(', ');
      profile.description = `${companyName} is a leading technology company specializing in ${expertise}. ${mission}. We are committed to innovation and delivering cutting-edge solutions for our clients.`;

      profile.website = `https://www.${companyName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')}.com`;
      profile.location = `${faker.location.city()}, ${faker.location.state({
        abbreviated: true,
      })}`;
      profile.companySize = faker.helpers.arrayElement([
        '1-10',
        '11-50',
        '51-200',
        '201-500',
        '500+',
      ]);
      profile.industry = 'Technology';

      // Generate realistic interview process
      const interviewSteps = [
        'Initial HR screening',
        'Technical assessment',
        'System design discussion',
        'Coding interview',
        'Team fit conversation',
        'Final executive round',
      ];
      profile.interviewProcess = faker.helpers
        .arrayElements(interviewSteps, faker.number.int({ min: 3, max: 5 }))
        .join(' → ');

      // Use predefined benefits
      profile.benefits = faker.helpers
        .arrayElements(TECH_BENEFITS, 5)
        .join(' • ');
      profile.workLocations = faker.helpers.arrayElement([
        'Remote',
        'On-site',
        'Hybrid',
      ]);

      // Leave seeker-specific fields empty
      profile.skills = [];
      profile.experienceLevel = '';
      profile.jobTypes = [];
      profile.bio = '';
      profile.salaryExpectation = '';
      profile.preferredLocation = '';
    } else {
      // Job Seeker profile
      profile.firstName = firstName;
      profile.lastName = lastName;
      profile.phone = faker.phone.number();

      // Generate realistic tech bio with diversity in career paths
      const yearsOfExperience = faker.number.int({ min: 0, max: 15 });
      const mainSkills = faker.helpers.arrayElements(TECH_SKILLS, 3);

      // Create more diverse backgrounds
      const backgrounds = [
        'Computer Science graduate',
        'Self-taught developer',
        'Bootcamp graduate',
        'Career transition from non-tech field',
        'Former educator',
        'Industry certification holder',
        'Open source contributor',
        'Tech apprenticeship graduate',
        'Former startup founder',
        'STEM graduate',
      ];

      const careerFocus = [
        'building accessible web applications',
        'developing cloud infrastructure',
        'creating mobile experiences',
        'data visualization',
        'backend systems',
        'AI/ML applications',
        'blockchain solutions',
        'security research',
        'IoT solutions',
        'developer tools',
        'cross-platform applications',
        'inclusive design',
        'international markets',
        'sustainable tech',
      ];

      const background = faker.helpers.arrayElement(backgrounds);
      const focus = faker.helpers.arrayElement(careerFocus);

      const bio = `${
        yearsOfExperience === 0
          ? 'Aspiring'
          : `${yearsOfExperience}+ years experienced`
      } developer passionate about ${mainSkills.join(
        ', '
      )}. ${background} with focus on ${focus}. ${faker.person.bio()}`;

      profile.bio = bio;

      // Generate realistic portfolio website
      profile.website = faker.helpers.arrayElement([
        `https://github.com/${firstName}-${lastName}`,
        `https://${firstName}${lastName}.dev`,
        `https://${firstName}-${lastName}.netlify.app`,
        `https://codepen.io/${firstName}${lastName}`,
        `https://dev.to/${firstName}${lastName}`,
        `https://${firstName}${lastName}.vercel.app`,
      ]);

      // Use predefined tech skills with some specialization
      const specializationSkills = new Set<string>();

      // Add some domain-specific skills based on career focus
      if (focus.includes('accessible') || focus.includes('inclusive')) {
        specializationSkills.add('Accessibility/ARIA');
        specializationSkills.add('Screen Reader Testing');
      } else if (focus.includes('cloud')) {
        specializationSkills.add(
          faker.helpers.arrayElement(['AWS', 'Azure', 'GCP'])
        );
        specializationSkills.add('Terraform');
      } else if (focus.includes('mobile')) {
        specializationSkills.add(
          faker.helpers.arrayElement([
            'React Native',
            'Flutter',
            'Swift',
            'Kotlin',
          ])
        );
      } else if (focus.includes('AI') || focus.includes('ML')) {
        specializationSkills.add(
          faker.helpers.arrayElement(['PyTorch', 'TensorFlow', 'scikit-learn'])
        );
      }

      // Add base skills
      const baseSkills = faker.helpers.arrayElements(
        TECH_SKILLS,
        faker.number.int({ min: 4, max: 8 })
      );

      profile.skills = [
        ...Array.from(specializationSkills),
        ...baseSkills,
      ].slice(0, 10); // Cap at 10 skills

      // Set experience level based on years with more granular levels
      profile.experienceLevel =
        yearsOfExperience === 0
          ? 'Entry Level'
          : yearsOfExperience <= 2
          ? 'Junior'
          : yearsOfExperience <= 5
          ? 'Mid Level'
          : yearsOfExperience <= 8
          ? 'Senior Level'
          : yearsOfExperience <= 12
          ? 'Lead'
          : 'Principal/Architect';

      // More diverse job types beyond traditional arrangements
      profile.jobTypes = faker.helpers.arrayElements(
        [
          'Full-time',
          'Part-time',
          'Contract',
          'Remote (Global)',
          'Remote (Regional)',
          'Hybrid',
          'On-site',
          'Internship/Apprenticeship',
          'Four-day workweek',
          'Project-based',
        ],
        faker.number.int({ min: 1, max: 3 })
      );

      // Generate realistic description based on experience, skills and focus
      const description = [
        `${profile.experienceLevel} developer with ${yearsOfExperience}+ years of experience.`,
        `Proficient in ${mainSkills.join(', ')}.`,
        `${background} specializing in ${focus}.`,
        `Seeking opportunities to work with ${faker.helpers
          .arrayElements(TECH_SKILLS, 2)
          .join(' and ')}.`,
      ].join(' ');
      profile.description = description;

      // Add more globally diverse locations
      const useGlobalLocation = Math.random() > 0.7; // 30% chance for global location
      if (useGlobalLocation) {
        const hub = faker.helpers.arrayElement(GLOBAL_TECH_HUBS);
        profile.location = `${hub.city}, ${hub.region}`;
      } else {
        profile.location = `${faker.location.city()}, ${faker.location.state({
          abbreviated: true,
        })}`;
      }

      // Generate realistic salary expectations based on experience level and location
      // Apply location-based multiplier
      const locationMultiplier = profile.location.includes('San Francisco')
        ? 1.5
        : profile.location.includes('New York')
        ? 1.4
        : profile.location.includes('London') ||
          profile.location.includes('Zurich')
        ? 1.3
        : profile.location.includes('Singapore') ||
          profile.location.includes('Tokyo')
        ? 1.2
        : profile.location.includes('Berlin') ||
          profile.location.includes('Toronto')
        ? 1.1
        : 1.0;

      const baseSalary = {
        'Entry Level': { min: 50000, max: 80000 },
        Junior: { min: 60000, max: 90000 },
        'Mid Level': { min: 80000, max: 120000 },
        'Senior Level': { min: 120000, max: 180000 },
        Lead: { min: 150000, max: 220000 },
        'Principal/Architect': { min: 180000, max: 250000 },
      }[profile.experienceLevel];

      const salary = Math.round(
        faker.number.int(baseSalary) * locationMultiplier
      );
      profile.salaryExpectation = `$${salary.toLocaleString()}`;

      // Preferred work locations with more diversity
      if (Math.random() > 0.5) {
        // 50% prefer remote or hybrid
        profile.preferredLocation = faker.helpers.arrayElement([
          'Remote (Anywhere)',
          'Remote (Same timezone)',
          'Hybrid (2-3 days in office)',
          'Hybrid (1 day in office)',
        ]);
      } else if (Math.random() > 0.5) {
        // 25% prefer their current location
        profile.preferredLocation = profile.location;
      } else {
        // 25% prefer a specific location
        const hub = faker.helpers.arrayElement(GLOBAL_TECH_HUBS);
        profile.preferredLocation = `${hub.city}, ${hub.region}`;
      }

      // Leave employer-specific fields empty
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

      // Generate realistic tech project names
      const prefix = faker.helpers.arrayElement(TECH_PROJECT_PREFIXES);
      const suffix = faker.helpers.arrayElement([
        'System',
        'Platform',
        'Service',
        'Tool',
        'Framework',
        'SDK',
      ]);
      project.name = `${prefix} ${suffix}`;

      // Get seeker's profile to align project with their skills
      const seekerProfile = profiles.find((p) => p.user.id === seeker.id);
      const projectSkills = faker.helpers.arrayElements(
        seekerProfile?.skills || TECH_SKILLS,
        faker.number.int({ min: 2, max: 5 })
      );

      // Generate realistic project description
      const description = [
        faker.helpers.arrayElement([
          'Developed and maintained',
          'Architected and implemented',
          'Designed and built',
          'Created and deployed',
        ]),
        `a ${prefix.toLowerCase()}`,
        'using',
        projectSkills.join(', '),
        '.',
        faker.helpers.arrayElement([
          'Improved performance by 40%',
          'Reduced deployment time by 60%',
          'Increased test coverage to 90%',
          'Scaled to handle 1M+ daily users',
          'Decreased error rates by 75%',
        ]),
        '.',
        faker.helpers.arrayElement([
          'Implemented CI/CD pipeline using GitHub Actions',
          'Containerized using Docker and Kubernetes',
          'Deployed on AWS using Infrastructure as Code',
          'Integrated with multiple third-party APIs',
          'Followed test-driven development practices',
        ]),
        '.',
      ].join(' ');

      project.description = description;
      project.skillsUsed = projectSkills;

      // Generate realistic project URLs
      project.url = faker.helpers.arrayElement([
        `https://github.com/${seekerProfile?.firstName}-${seekerProfile?.lastName}/` +
          project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        `https://${project.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')}.demo-app.dev`,
        `https://demo.${project.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')}.tech`,
      ]);

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
    const employerProfile = profiles.find((p) => p.user.id === employer.id);

    for (let j = 0; j < numJobs; j++) {
      const job = new Job();
      job.recruiter = employer;

      // Generate realistic tech job titles using expanded roles
      const role = faker.helpers.arrayElement([
        // Traditional engineering roles
        'Software Engineer',
        'Full Stack Developer',
        'Frontend Developer',
        'Backend Developer',
        'DevOps Engineer',
        'Site Reliability Engineer',
        'Cloud Engineer',
        'Data Engineer',
        'Machine Learning Engineer',
        'Mobile Developer',
        // Diverse tech roles
        'Product Manager',
        'UX/UI Designer',
        'Technical Writer',
        'Developer Advocate',
        'QA Engineer',
        'Data Scientist',
        'Solutions Architect',
        'Accessibility Specialist',
        'Information Security Analyst',
        'Technical Project Manager',
      ]);

      const level = faker.helpers.arrayElement([
        'Junior',
        'Mid',
        'Senior',
        'Lead',
        'Staff',
        'Principal',
      ]);

      job.title =
        level !== 'Junior' && level !== 'Mid' ? `${level} ${role}` : role;

      // Set department from our enhanced tech departments
      job.department = faker.helpers.arrayElement(TECH_DEPARTMENTS);

      // Generate realistic required skills based on the job title
      const baseSkills = new Set<string>();
      if (job.title.includes('Frontend') || job.title.includes('UX/UI')) {
        baseSkills.add('JavaScript');
        baseSkills.add('HTML5');
        baseSkills.add('CSS3');
        baseSkills.add(
          faker.helpers.arrayElement(['React', 'Angular', 'Vue.js'])
        );
        if (job.title.includes('UX/UI')) {
          baseSkills.add('Figma');
          baseSkills.add('User Research');
        }
      } else if (job.title.includes('Backend')) {
        baseSkills.add(
          faker.helpers.arrayElement(['Node.js', 'Python', 'Java', 'Go'])
        );
        baseSkills.add(faker.helpers.arrayElement(['PostgreSQL', 'MongoDB']));
        baseSkills.add('REST APIs');
      } else if (
        job.title.includes('DevOps') ||
        job.title.includes('SRE') ||
        job.title.includes('Reliability')
      ) {
        baseSkills.add('Docker');
        baseSkills.add('Kubernetes');
        baseSkills.add(faker.helpers.arrayElement(['AWS', 'Azure', 'GCP']));
        baseSkills.add('CI/CD');
        baseSkills.add('Infrastructure as Code');
      } else if (job.title.includes('Data Scientist')) {
        baseSkills.add('Python');
        baseSkills.add(faker.helpers.arrayElement(['PyTorch', 'TensorFlow']));
        baseSkills.add('Data Analysis');
        baseSkills.add('Statistics');
      } else if (job.title.includes('Technical Writer')) {
        baseSkills.add('Documentation');
        baseSkills.add('Markdown');
        baseSkills.add('Technical Communication');
        baseSkills.add('API Documentation');
      } else if (job.title.includes('Accessibility')) {
        baseSkills.add('WCAG Standards');
        baseSkills.add('Screen Reader Testing');
        baseSkills.add('Inclusive Design');
      } else if (job.title.includes('Security')) {
        baseSkills.add('Security Auditing');
        baseSkills.add('OWASP');
        baseSkills.add('Penetration Testing');
      }

      // Add some common skills
      baseSkills.add('Git');
      baseSkills.add('Agile');

      // Add random relevant skills
      const additionalSkills = faker.helpers.arrayElements(
        TECH_SKILLS.filter((skill) => !Array.from(baseSkills).includes(skill)),
        faker.number.int({ min: 2, max: 4 })
      );

      job.requiredSkills = [...Array.from(baseSkills), ...additionalSkills];

      // Generate realistic job description
      const responsibilities = [
        'Design and implement scalable solutions',
        'Collaborate with cross-functional teams',
        'Write clean, maintainable, and well-tested code',
        'Participate in code reviews and technical discussions',
        'Troubleshoot and debug complex issues',
        'Mentor junior developers and team members',
        'Contribute to system architecture decisions',
        'Optimize application performance',
        'Create inclusive and accessible software',
        'Document solutions and technical specifications',
        'Engage with community and advocate for best practices',
        'Implement security best practices',
        'Develop automation for repetitive tasks',
        'Analyze user needs and propose technical solutions',
        'Support global and diverse user bases',
      ];

      const description = [
        `${employerProfile?.firstName} is seeking a ${job.title} to join our growing team.`,
        '\n\nResponsibilities:\n- ' +
          faker.helpers.arrayElements(responsibilities, 4).join('\n- '),
        '\n\nRequired Skills:\n- ' + job.requiredSkills.join('\n- '),
        '\n\nRequirements:\n- ' +
          TECH_JOB_REQUIREMENTS[
            level === 'Junior' || level === 'Mid'
              ? 'Entry Level'
              : level === 'Senior'
              ? 'Senior Level'
              : level === 'Lead' || level === 'Staff'
              ? 'Lead'
              : 'Manager'
          ].join('\n- '),
        '\n\nBenefits:\n- ' +
          faker.helpers.arrayElements(TECH_BENEFITS, 5).join('\n- '),
      ].join('\n');

      job.description = description;

      // Use more globally diverse locations
      const useGlobalHub = Math.random() > 0.6; // 40% chance for global locations
      if (useGlobalHub) {
        const hub = faker.helpers.arrayElement(GLOBAL_TECH_HUBS);
        job.location = `${hub.city}, ${hub.region}`;
      } else {
        job.location =
          employerProfile?.location ||
          `${faker.location.city()}, ${faker.location.state({
            abbreviated: true,
          })}`;
      }

      // Use expanded employment type options
      job.employmentType = faker.helpers.arrayElement([
        'Full-time',
        'Part-time',
        'Contract',
        'Remote (Global)',
        'Remote (Regional)',
        'Hybrid',
        'On-site',
        'Internship/Apprenticeship',
        'Four-day workweek',
      ]);

      // Generate realistic salary ranges based on level and location
      // Apply location-based salary multiplier
      const locationMultiplier = job.location.includes('San Francisco')
        ? 1.5
        : job.location.includes('New York')
        ? 1.4
        : job.location.includes('London') || job.location.includes('Zurich')
        ? 1.3
        : job.location.includes('Singapore') || job.location.includes('Tokyo')
        ? 1.2
        : job.location.includes('Berlin') || job.location.includes('Toronto')
        ? 1.1
        : 1.0;

      const baseSalary = {
        Junior: { min: 60000, max: 90000 },
        Mid: { min: 80000, max: 120000 },
        Senior: { min: 120000, max: 180000 },
        Lead: { min: 150000, max: 220000 },
        Staff: { min: 180000, max: 250000 },
        Principal: { min: 200000, max: 300000 },
      }[level];

      const minSalary = Math.round(
        faker.number.int({
          min: baseSalary.min,
          max: baseSalary.min + 20000,
        }) * locationMultiplier
      );

      // Ensure maxSalary is always greater than minSalary
      const minMaxSalary = minSalary + 5000;
      const maxMaxSalary = Math.round(baseSalary.max * locationMultiplier);

      // If the calculated minMaxSalary is less than maxMaxSalary, use the range; otherwise, add a fixed amount to minSalary
      const maxSalary =
        minMaxSalary < maxMaxSalary
          ? Math.round(
              faker.number.int({ min: minMaxSalary, max: maxMaxSalary })
            )
          : minSalary + 20000;

      job.salaryRange = `$${minSalary.toLocaleString()} - $${maxSalary.toLocaleString()}`;

      // More diverse experience requirements
      job.experience =
        level === 'Junior'
          ? 'Entry Level'
          : level === 'Mid'
          ? '2-4 years'
          : level === 'Senior'
          ? '5+ years'
          : level === 'Lead'
          ? '7+ years'
          : '8+ years';

      // More diverse education requirements
      job.education = faker.helpers.arrayElement([
        "Bachelor's in Computer Science or related field",
        "Master's in Computer Science or related field",
        'Equivalent practical experience',
        'Bootcamp graduate with relevant experience',
        'Self-taught with proven experience',
        'Industry certification with experience',
        'Any educational background with relevant skills',
        'Technical degree or comparable experience',
      ]);

      job.benefits = faker.helpers.arrayElements(TECH_BENEFITS, 5).join(' • ');
      job.workingHours = faker.helpers.arrayElement([
        'Flexible hours',
        'Core hours 10 AM - 4 PM',
        'Standard business hours',
        'Flexible schedule across time zones',
        'Results-based work (no fixed hours)',
        'Four-day workweek (32 hours)',
        'Customizable schedule based on team needs',
      ]);

      job.status = faker.helpers.arrayElement([
        'active',
        'active',
        'active',
        'active',
        'active', // 5x weight for active
        'draft',
        'draft', // 2x weight for draft
        'closed', // 1x weight for closed
      ]);

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
