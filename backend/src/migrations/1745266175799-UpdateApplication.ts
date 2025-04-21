import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateApplication1745266175799 implements MigrationInterface {
    name = 'UpdateApplication1745266175799'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job" ALTER COLUMN "requiredSkills" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job" ALTER COLUMN "requiredSkills" DROP NOT NULL`);
    }

}
