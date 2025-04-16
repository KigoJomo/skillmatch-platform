import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1713237600000 implements MigrationInterface {
  name = 'InitialSchema1713237600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create UUID extension if it doesn't exist
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create users table
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "email" character varying NOT NULL,
                "passwordHash" character varying NOT NULL,
                "role" character varying NOT NULL DEFAULT 'seeker',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);

    // Create profiles table
    await queryRunner.query(`
            CREATE TABLE "profiles" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "bio" character varying,
                "skills" text,
                "experience" jsonb,
                "location" character varying,
                "education" character varying,
                "avatarUrl" character varying,
                "resumeUrl" character varying,
                "linkedIn" character varying,
                "github" character varying,
                "website" character varying,
                "companyName" character varying,
                "companySize" character varying,
                "industry" character varying,
                "userId" uuid,
                CONSTRAINT "REL_315ecd98bd1a42dcf2ec4e2e98" UNIQUE ("userId"),
                CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id")
            )
        `);

    // Create jobs table
    await queryRunner.query(`
            CREATE TABLE "jobs" (
                "id" SERIAL NOT NULL,
                "title" character varying NOT NULL,
                "description" text NOT NULL,
                "location" character varying NOT NULL,
                "requirements" text NOT NULL,
                "type" character varying NOT NULL,
                "salary" character varying,
                "postedDate" TIMESTAMP NOT NULL DEFAULT now(),
                "postedById" uuid,
                CONSTRAINT "PK_cf0a6c42b72fcc7f7c237def345" PRIMARY KEY ("id")
            )
        `);

    // Create applications table
    await queryRunner.query(`
            CREATE TABLE "applications" (
                "id" SERIAL NOT NULL,
                "coverLetter" text,
                "status" character varying NOT NULL DEFAULT 'pending',
                "appliedDate" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" uuid,
                "jobId" integer,
                CONSTRAINT "PK_938c0a27255637bde919591888f" PRIMARY KEY ("id")
            )
        `);

    // Add foreign keys
    await queryRunner.query(`
            ALTER TABLE "profiles"
            ADD CONSTRAINT "FK_315ecd98bd1a42dcf2ec4e2e985"
            FOREIGN KEY ("userId")
            REFERENCES "users"("id")
            ON DELETE CASCADE
            ON UPDATE NO ACTION
        `);

    await queryRunner.query(`
            ALTER TABLE "jobs"
            ADD CONSTRAINT "FK_919fcf99a47a47f48ebf3127647"
            FOREIGN KEY ("postedById")
            REFERENCES "users"("id")
            ON DELETE SET NULL
            ON UPDATE NO ACTION
        `);

    await queryRunner.query(`
            ALTER TABLE "applications"
            ADD CONSTRAINT "FK_3091c4cb421928bba29a965c8e7"
            FOREIGN KEY ("userId")
            REFERENCES "users"("id")
            ON DELETE CASCADE
            ON UPDATE NO ACTION
        `);

    await queryRunner.query(`
            ALTER TABLE "applications"
            ADD CONSTRAINT "FK_9f7a5fd25da40d05c651acc2ae9"
            FOREIGN KEY ("jobId")
            REFERENCES "jobs"("id")
            ON DELETE CASCADE
            ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys first
    await queryRunner.query(
      `ALTER TABLE "applications" DROP CONSTRAINT "FK_9f7a5fd25da40d05c651acc2ae9"`
    );
    await queryRunner.query(
      `ALTER TABLE "applications" DROP CONSTRAINT "FK_3091c4cb421928bba29a965c8e7"`
    );
    await queryRunner.query(
      `ALTER TABLE "jobs" DROP CONSTRAINT "FK_919fcf99a47a47f48ebf3127647"`
    );
    await queryRunner.query(
      `ALTER TABLE "profiles" DROP CONSTRAINT "FK_315ecd98bd1a42dcf2ec4e2e985"`
    );

    // Drop tables
    await queryRunner.query(`DROP TABLE "applications"`);
    await queryRunner.query(`DROP TABLE "jobs"`);
    await queryRunner.query(`DROP TABLE "profiles"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
