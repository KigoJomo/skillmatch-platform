import { MigrationInterface, QueryRunner } from "typeorm";

export class Scaffold1745291414502 implements MigrationInterface {
    name = 'Scaffold1745291414502'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying, "lastName" character varying, "phone" character varying, "description" character varying, "website" character varying, "skills" text array, "experienceLevel" character varying, "jobTypes" text array, "bio" character varying, "location" character varying, "salaryExpectation" character varying, "preferredLocation" character varying, "companySize" character varying, "industry" character varying, "interviewProcess" character varying, "benefits" character varying, "workLocations" character varying, "salaryRange" character varying, "userId" uuid, CONSTRAINT "REL_a24972ebd73b106250713dcddd" UNIQUE ("userId"), CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat_session" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sessionStart" TIMESTAMP NOT NULL DEFAULT now(), "context" json, "userId" uuid, CONSTRAINT "PK_9017c2ee500cd1ba895752a0aa7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "job_match" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "matchedAt" TIMESTAMP NOT NULL DEFAULT now(), "jobSeekerId" uuid, "jobId" uuid, CONSTRAINT "PK_eb31e50b81a97ab7e78a161aa05" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "job" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text NOT NULL, "location" character varying NOT NULL, "department" character varying NOT NULL, "employmentType" character varying NOT NULL, "salaryRange" character varying, "experience" text NOT NULL, "education" text NOT NULL, "benefits" text NOT NULL, "workingHours" character varying NOT NULL, "requiredSkills" text NOT NULL, "status" character varying NOT NULL DEFAULT 'draft', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "recruiterId" uuid, CONSTRAINT "PK_98ab1c14ff8d1cf80d18703b92f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "job_application" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "coverLetter" text NOT NULL, "status" character varying NOT NULL DEFAULT 'Pending', "matchPercentage" double precision NOT NULL DEFAULT '0', "appliedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "applicantId" uuid, "jobId" uuid, CONSTRAINT "PK_c0b8f6b6341802967369b5d70f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text, "url" character varying, "skillsUsed" text array, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('Job Seeker', 'Employer/Recruiter')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'Job Seeker', "onboardingCompleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "auth_session" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "refreshToken" character varying NOT NULL, "ipAddress" character varying NOT NULL, "userAgent" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_19354ed146424a728c1112a8cbf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "FK_a24972ebd73b106250713dcddd9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_session" ADD CONSTRAINT "FK_b371c02a2bc22cb175ded401292" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job_match" ADD CONSTRAINT "FK_b740920f3a193fccdda09e1bd70" FOREIGN KEY ("jobSeekerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job_match" ADD CONSTRAINT "FK_bad75eec2b70c80c5e624c4cd9b" FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job" ADD CONSTRAINT "FK_1e53d88d55496cd45b9fa1392b3" FOREIGN KEY ("recruiterId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job_application" ADD CONSTRAINT "FK_0f72681370346063768901281b6" FOREIGN KEY ("applicantId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job_application" ADD CONSTRAINT "FK_d0452612ad9cb0e20f6f320ebc0" FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_7c4b0d3b77eaf26f8b4da879e63" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "auth_session" ADD CONSTRAINT "FK_c072b729d71697f959bde66ade0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth_session" DROP CONSTRAINT "FK_c072b729d71697f959bde66ade0"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_7c4b0d3b77eaf26f8b4da879e63"`);
        await queryRunner.query(`ALTER TABLE "job_application" DROP CONSTRAINT "FK_d0452612ad9cb0e20f6f320ebc0"`);
        await queryRunner.query(`ALTER TABLE "job_application" DROP CONSTRAINT "FK_0f72681370346063768901281b6"`);
        await queryRunner.query(`ALTER TABLE "job" DROP CONSTRAINT "FK_1e53d88d55496cd45b9fa1392b3"`);
        await queryRunner.query(`ALTER TABLE "job_match" DROP CONSTRAINT "FK_bad75eec2b70c80c5e624c4cd9b"`);
        await queryRunner.query(`ALTER TABLE "job_match" DROP CONSTRAINT "FK_b740920f3a193fccdda09e1bd70"`);
        await queryRunner.query(`ALTER TABLE "chat_session" DROP CONSTRAINT "FK_b371c02a2bc22cb175ded401292"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_a24972ebd73b106250713dcddd9"`);
        await queryRunner.query(`DROP TABLE "auth_session"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "project"`);
        await queryRunner.query(`DROP TABLE "job_application"`);
        await queryRunner.query(`DROP TABLE "job"`);
        await queryRunner.query(`DROP TABLE "job_match"`);
        await queryRunner.query(`DROP TABLE "chat_session"`);
        await queryRunner.query(`DROP TABLE "profile"`);
    }

}
