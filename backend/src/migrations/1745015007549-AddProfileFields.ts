import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProfileFields1745015007549 implements MigrationInterface {
    name = 'AddProfileFields1745015007549'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" ADD "website" character varying`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "interviewProcess" character varying`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "benefits" character varying`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "workLocations" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "workLocations"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "benefits"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "interviewProcess"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "website"`);
    }

}
