import {MigrationInterface, QueryRunner} from "typeorm";

export class AddEndDateToProjectStructure1664828896413 implements MigrationInterface {
    name = 'AddEndDateToProjectStructure1664828896413'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_entity" ADD "endDate" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_entity" DROP COLUMN "endDate"`);
    }

}
