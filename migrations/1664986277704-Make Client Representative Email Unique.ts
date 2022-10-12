import {MigrationInterface, QueryRunner} from "typeorm";

export class MakeClientRepresentativeEmailUnique1664986277704 implements MigrationInterface {
    name = 'MakeClientRepresentativeEmailUnique1664986277704'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_representative_entity" ADD CONSTRAINT "UQ_c4a40e2ac72ab7920b45390cfbd" UNIQUE ("email")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_representative_entity" DROP CONSTRAINT "UQ_c4a40e2ac72ab7920b45390cfbd"`);
    }

}
