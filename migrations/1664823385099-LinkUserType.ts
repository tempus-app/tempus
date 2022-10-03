import {MigrationInterface, QueryRunner} from "typeorm";

export class LinkUserType1664823385099 implements MigrationInterface {
    name = 'LinkUserType1664823385099'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."link_entity_usertype_enum" AS ENUM('ASSIGNED_RESOURCE', 'AVAILABLE_RESOURCE', 'BUSINESS_OWNER', 'SUPERVISOR', 'USER')`);
        await queryRunner.query(`ALTER TABLE "link_entity" ADD "userType" "public"."link_entity_usertype_enum" NOT NULL DEFAULT 'AVAILABLE_RESOURCE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link_entity" DROP COLUMN "userType"`);
        await queryRunner.query(`DROP TYPE "public"."link_entity_usertype_enum"`);
    }

}
