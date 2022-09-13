import {MigrationInterface, QueryRunner} from "typeorm";

export class SaveOriginalResume1663108727675 implements MigrationInterface {
    name = 'SaveOriginalResume1663108727675'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "resume" bytea`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "resume"`);
    }

}
