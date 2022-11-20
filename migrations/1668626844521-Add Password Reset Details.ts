import {MigrationInterface, QueryRunner} from "typeorm";

export class AddPasswordResetDetails1668626844521 implements MigrationInterface {
    name = 'AddPasswordResetDetails1668626844521'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."password_reset_entity_status_enum" AS ENUM('VALID', 'INVALID')`);
        await queryRunner.query(`CREATE TABLE "password_reset_entity" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "expiry" TIMESTAMP NOT NULL, "status" "public"."password_reset_entity_status_enum" NOT NULL, "userId" integer, CONSTRAINT "PK_7481a83d8311ff76a0cdced20a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "password_reset_entity" ADD CONSTRAINT "FK_557ef2e1c202ee53278c3eae789" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "password_reset_entity" DROP CONSTRAINT "FK_557ef2e1c202ee53278c3eae789"`);
        await queryRunner.query(`DROP TABLE "password_reset_entity"`);
        await queryRunner.query(`DROP TYPE "public"."password_reset_entity_status_enum"`);
    }

}
