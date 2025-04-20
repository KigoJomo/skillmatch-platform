import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSalaryRange1745015604615 implements MigrationInterface {
    name = 'AddSalaryRange1745015604615'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" ADD "salaryRange" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "salaryRange"`);
    }

}
