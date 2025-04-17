import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import { UserRole } from '../entities/User';
import { MessageRole } from '../entities/ChatMessage';
import { ApplicationStatus } from '../entities/Application';

export class InitialSchema1713237600000 implements MigrationInterface {
  name = 'InitialSchema1713237600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'passwordHash',
            type: 'varchar',
          },
          {
            name: 'role',
            type: 'enum',
            enum: ['Job Seeker', 'Employer/Recruiter'],
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      })
    );

    // Create profiles table
    await queryRunner.createTable(
      new Table({
        name: 'profiles',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'userId',
            type: 'uuid',
          },
          {
            name: 'bio',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'phone',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'skills',
            type: 'text',
            isArray: true,
            isNullable: true,
          },
          {
            name: 'experienceLevel',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'jobTypes',
            type: 'text',
            isArray: true,
            isNullable: true,
          },
          {
            name: 'salaryExpectation',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'preferredLocation',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'location',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'experience',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'education',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'avatarUrl',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'resumeUrl',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'linkedIn',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'github',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'website',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'companyName',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'companySize',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'industry',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'workLocations',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'interviewProcess',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'benefits',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'salaryRange',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'onboardingCompleted',
            type: 'boolean',
            default: false,
          },
        ],
      })
    );

    // Create jobs table
    await queryRunner.createTable(
      new Table({
        name: 'jobs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'text',
          },
          {
            name: 'company',
            type: 'varchar',
          },
          {
            name: 'location',
            type: 'varchar',
          },
          {
            name: 'salary',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'jobType',
            type: 'varchar',
          },
          {
            name: 'experienceLevel',
            type: 'varchar',
          },
          {
            name: 'requiredSkills',
            type: 'text',
            isArray: true,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'postedDate',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'postedById',
            type: 'uuid',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      })
    );

    // Create applications table
    await queryRunner.createTable(
      new Table({
        name: 'applications',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'jobId',
            type: 'uuid',
          },
          {
            name: 'userId',
            type: 'uuid',
          },
          {
            name: 'coverLetter',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'resumeUrl',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'answers',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'matchScore',
            type: 'float',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: Object.values(ApplicationStatus),
            default: "'pending'",
          },
          {
            name: 'appliedDate',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      })
    );

    // Create chat_sessions table
    await queryRunner.createTable(
      new Table({
        name: 'chat_sessions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'userId',
            type: 'uuid',
          },
          {
            name: 'sessionStart',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'sessionEnd',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'context',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      })
    );

    // Create chat_messages table
    await queryRunner.createTable(
      new Table({
        name: 'chat_messages',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'sessionId',
            type: 'uuid',
          },
          {
            name: 'role',
            type: 'enum',
            enum: Object.values(MessageRole),
          },
          {
            name: 'content',
            type: 'text',
          },
          {
            name: 'timestamp',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'metadata',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'relevantData',
            type: 'jsonb',
            isNullable: true,
          },
        ],
      })
    );

    // Add foreign key constraints
    await queryRunner.createForeignKey(
      'profiles',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'jobs',
      new TableForeignKey({
        columnNames: ['postedById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'applications',
      new TableForeignKey({
        columnNames: ['jobId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'jobs',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'applications',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'chat_sessions',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'chat_messages',
      new TableForeignKey({
        columnNames: ['sessionId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'chat_sessions',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('chat_messages');
    await queryRunner.dropTable('chat_sessions');
    await queryRunner.dropTable('applications');
    await queryRunner.dropTable('jobs');
    await queryRunner.dropTable('profiles');
    await queryRunner.dropTable('users');
  }
}
