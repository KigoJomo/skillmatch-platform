import { MigrationInterface, QueryRunner } from "typeorm";

export class AddJobReqSkills1745228288890 implements MigrationInterface {
    name = 'AddJobReqSkills1745228288890'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job" ADD "requiredSkills" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job" DROP COLUMN "requiredSkills"`);
    }

}
