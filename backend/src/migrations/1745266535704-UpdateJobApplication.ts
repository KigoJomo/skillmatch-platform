import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateJobApplication1745266535704 implements MigrationInterface {
    name = 'UpdateJobApplication1745266535704'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_application" ADD "matchPercentage" double precision NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "job_application" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_application" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "job_application" DROP COLUMN "matchPercentage"`);
    }

}
