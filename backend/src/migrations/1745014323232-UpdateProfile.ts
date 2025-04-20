import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProfile1745014323232 implements MigrationInterface {
    name = 'UpdateProfile1745014323232'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" ADD "phone" character varying`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "salaryExpectation" character varying`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "preferredLocation" character varying`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "companySize" character varying`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "industry" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "industry"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "companySize"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "preferredLocation"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "salaryExpectation"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "phone"`);
    }

}
