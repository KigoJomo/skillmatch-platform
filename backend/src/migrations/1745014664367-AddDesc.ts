import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDesc1745014664367 implements MigrationInterface {
    name = 'AddDesc1745014664367'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" ADD "description" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "description"`);
    }

}
