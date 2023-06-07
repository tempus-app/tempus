import {MigrationInterface, QueryRunner} from "typeorm";

export class AllowDuplicateEmailsForLink1670453834137 implements MigrationInterface {
    name = 'AllowDuplicateEmailsForLink1670453834137'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link_entity" DROP CONSTRAINT "UQ_9457468f6bf7dbf40ee7d1e4214"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link_entity" ADD CONSTRAINT "UQ_9457468f6bf7dbf40ee7d1e4214" UNIQUE ("email")`);
    }

}
