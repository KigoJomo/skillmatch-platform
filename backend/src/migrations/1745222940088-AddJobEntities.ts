import { MigrationInterface, QueryRunner } from "typeorm";

export class AddJobEntities1745222940088 implements MigrationInterface {
    name = 'AddJobEntities1745222940088'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "job" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text NOT NULL, "location" character varying NOT NULL, "salaryRange" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "recruiterId" uuid, CONSTRAINT "PK_98ab1c14ff8d1cf80d18703b92f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "job_application" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "coverLetter" text NOT NULL, "status" character varying NOT NULL DEFAULT 'Pending', "appliedAt" TIMESTAMP NOT NULL DEFAULT now(), "applicantId" uuid, "jobId" uuid, CONSTRAINT "PK_c0b8f6b6341802967369b5d70f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "job_match" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "matchedAt" TIMESTAMP NOT NULL DEFAULT now(), "jobSeekerId" uuid, "jobId" uuid, CONSTRAINT "PK_eb31e50b81a97ab7e78a161aa05" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "job" ADD CONSTRAINT "FK_1e53d88d55496cd45b9fa1392b3" FOREIGN KEY ("recruiterId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job_application" ADD CONSTRAINT "FK_0f72681370346063768901281b6" FOREIGN KEY ("applicantId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job_application" ADD CONSTRAINT "FK_d0452612ad9cb0e20f6f320ebc0" FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job_match" ADD CONSTRAINT "FK_b740920f3a193fccdda09e1bd70" FOREIGN KEY ("jobSeekerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job_match" ADD CONSTRAINT "FK_bad75eec2b70c80c5e624c4cd9b" FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_match" DROP CONSTRAINT "FK_bad75eec2b70c80c5e624c4cd9b"`);
        await queryRunner.query(`ALTER TABLE "job_match" DROP CONSTRAINT "FK_b740920f3a193fccdda09e1bd70"`);
        await queryRunner.query(`ALTER TABLE "job_application" DROP CONSTRAINT "FK_d0452612ad9cb0e20f6f320ebc0"`);
        await queryRunner.query(`ALTER TABLE "job_application" DROP CONSTRAINT "FK_0f72681370346063768901281b6"`);
        await queryRunner.query(`ALTER TABLE "job" DROP CONSTRAINT "FK_1e53d88d55496cd45b9fa1392b3"`);
        await queryRunner.query(`DROP TABLE "job_match"`);
        await queryRunner.query(`DROP TABLE "job_application"`);
        await queryRunner.query(`DROP TABLE "job"`);
    }

}
