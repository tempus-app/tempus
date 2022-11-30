import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCALEmail1669228271904 implements MigrationInterface {
    name = 'AddCALEmail1669228271904'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "calEmail" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "calEmail"`);
    }

}
