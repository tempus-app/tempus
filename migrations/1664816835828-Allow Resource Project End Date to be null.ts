import {MigrationInterface, QueryRunner} from "typeorm";

export class AllowResourceProjectEndDateToBeNull1664816835828 implements MigrationInterface {
    name = 'AllowResourceProjectEndDateToBeNull1664816835828'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_resource_entity" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "project_resource_entity" ALTER COLUMN "endDate" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_resource_entity" ALTER COLUMN "endDate" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project_resource_entity" ADD "email" character varying NOT NULL`);
    }

}
