import {MigrationInterface, QueryRunner} from "typeorm";

export class AllowProjectResourceRoleTypeAndRemoveProjectManagerPropertyFromProject1664820640542 implements MigrationInterface {
    name = 'AllowProjectResourceRoleTypeAndRemoveProjectManagerPropertyFromProject1664820640542'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_entity" DROP CONSTRAINT "FK_4a7f39569bf08b65975735b2419"`);
        await queryRunner.query(`ALTER TABLE "project_entity" DROP COLUMN "projectManagerId"`);
        await queryRunner.query(`ALTER TABLE "project_resource_entity" ADD "title" character varying`);
        await queryRunner.query(`ALTER TABLE "project_entity" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "project_entity" ADD "status" "public"."project_entity_status_enum" NOT NULL DEFAULT 'not_started'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_entity" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "project_entity" ADD "status" "public"."project_entity_status_enum" array NOT NULL DEFAULT '{not_started}'`);
        await queryRunner.query(`ALTER TABLE "project_resource_entity" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "project_entity" ADD "projectManagerId" integer`);
        await queryRunner.query(`ALTER TABLE "project_entity" ADD CONSTRAINT "FK_4a7f39569bf08b65975735b2419" FOREIGN KEY ("projectManagerId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
