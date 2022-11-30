import {MigrationInterface, QueryRunner} from "typeorm";

export class removeExperienceSummary1669231934847 implements MigrationInterface {
    name = 'removeExperienceSummary1669231934847'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "experience_entity" DROP COLUMN "summary"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "experience_entity" ADD "summary" character varying NOT NULL`);
    }

}
