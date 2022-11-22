import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateProjectStatusEnum1668623338353 implements MigrationInterface {
    name = 'UpdateProjectStatusEnum1668623338353'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."project_entity_status_enum" RENAME TO "project_entity_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."project_entity_status_enum" AS ENUM('Not Started', 'active', 'completed')`);
        await queryRunner.query(`ALTER TABLE "project_entity" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "project_entity" ALTER COLUMN "status" TYPE "public"."project_entity_status_enum" USING "status"::"text"::"public"."project_entity_status_enum"`);
        await queryRunner.query(`ALTER TABLE "project_entity" ALTER COLUMN "status" SET DEFAULT 'Not Started'`);
        await queryRunner.query(`DROP TYPE "public"."project_entity_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."project_entity_status_enum_old" AS ENUM('not_started', 'active', 'completed')`);
        await queryRunner.query(`ALTER TABLE "project_entity" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "project_entity" ALTER COLUMN "status" TYPE "public"."project_entity_status_enum_old" USING "status"::"text"::"public"."project_entity_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "project_entity" ALTER COLUMN "status" SET DEFAULT 'not_started'`);
        await queryRunner.query(`DROP TYPE "public"."project_entity_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."project_entity_status_enum_old" RENAME TO "project_entity_status_enum"`);
    }

}
