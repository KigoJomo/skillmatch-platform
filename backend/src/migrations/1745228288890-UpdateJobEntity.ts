import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateJobEntity1745228288890 implements MigrationInterface {
  name = 'UpdateJobEntity1745228288890';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "job" ADD "department" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "job" ADD "employmentType" character varying NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "job" ADD "experience" text NOT NULL`);
    await queryRunner.query(`ALTER TABLE "job" ADD "education" text NOT NULL`);
    await queryRunner.query(`ALTER TABLE "job" ADD "benefits" text NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "job" ADD "workingHours" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "job" ADD "status" character varying NOT NULL DEFAULT 'draft'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "job" DROP COLUMN "status"`);
    await queryRunner.query(`ALTER TABLE "job" DROP COLUMN "workingHours"`);
    await queryRunner.query(`ALTER TABLE "job" DROP COLUMN "benefits"`);
    await queryRunner.query(`ALTER TABLE "job" DROP COLUMN "education"`);
    await queryRunner.query(`ALTER TABLE "job" DROP COLUMN "experience"`);
    await queryRunner.query(`ALTER TABLE "job" DROP COLUMN "employmentType"`);
    await queryRunner.query(`ALTER TABLE "job" DROP COLUMN "department"`);
  }
}
