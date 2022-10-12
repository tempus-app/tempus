import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateProjectStructure1664474049745 implements MigrationInterface {
    name = 'UpdateProjectStructure1664474049745'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_entity" DROP CONSTRAINT "CHK_f3984456bd34b07f681f7b6d66"`);
        await queryRunner.query(`CREATE TABLE "client_representative_entity" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "clientId" integer, CONSTRAINT "PK_26ae1d99a71378744b823f89f20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "project_entity" DROP COLUMN "endDate"`);
        await queryRunner.query(`CREATE TYPE "public"."project_entity_status_enum" AS ENUM('not_started', 'active', 'completed')`);
        await queryRunner.query(`ALTER TABLE "project_entity" ADD "status" "public"."project_entity_status_enum" array NOT NULL DEFAULT '{not_started}'`);
        await queryRunner.query(`ALTER TABLE "project_entity" ADD "projectManagerId" integer`);
        await queryRunner.query(`ALTER TABLE "project_entity" ADD "clientRepresentativeId" integer`);
        await queryRunner.query(`ALTER TABLE "project_entity" ADD CONSTRAINT "FK_4a7f39569bf08b65975735b2419" FOREIGN KEY ("projectManagerId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_entity" ADD CONSTRAINT "FK_96119320eb64130d43ec4cc247d" FOREIGN KEY ("clientRepresentativeId") REFERENCES "client_representative_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client_representative_entity" ADD CONSTRAINT "FK_6a026db3b1ae4e35e53b46ae4fb" FOREIGN KEY ("clientId") REFERENCES "client_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_representative_entity" DROP CONSTRAINT "FK_6a026db3b1ae4e35e53b46ae4fb"`);
        await queryRunner.query(`ALTER TABLE "project_entity" DROP CONSTRAINT "FK_96119320eb64130d43ec4cc247d"`);
        await queryRunner.query(`ALTER TABLE "project_entity" DROP CONSTRAINT "FK_4a7f39569bf08b65975735b2419"`);
        await queryRunner.query(`ALTER TABLE "project_entity" DROP COLUMN "clientRepresentativeId"`);
        await queryRunner.query(`ALTER TABLE "project_entity" DROP COLUMN "projectManagerId"`);
        await queryRunner.query(`ALTER TABLE "project_entity" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."project_entity_status_enum"`);
        await queryRunner.query(`ALTER TABLE "project_entity" ADD "endDate" TIMESTAMP NOT NULL`);
        await queryRunner.query(`DROP TABLE "client_representative_entity"`);
        await queryRunner.query(`ALTER TABLE "project_entity" ADD CONSTRAINT "CHK_f3984456bd34b07f681f7b6d66" CHECK (("endDate" >= "startDate"))`);
    }

}
