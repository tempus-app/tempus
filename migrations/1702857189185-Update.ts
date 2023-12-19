import {MigrationInterface, QueryRunner} from "typeorm";

export class Update1702857189185 implements MigrationInterface {
    name = 'Update1702857189185'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "calendar_entity" ("id" SERIAL NOT NULL, "holidayDates" character varying, CONSTRAINT "PK_782409eb79dade14f5744b326e4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "revised_timesheet_entity" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP, "approved" boolean, CONSTRAINT "PK_37e977fe7695ee8bd273d9c813b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."timesheet_entity_status_enum" AS ENUM('NEW', 'APPROVED', 'SUBMITTED', 'REJECTED', 'CLIENT REVIEW')`);
        await queryRunner.query(`CREATE TABLE "timesheet_entity" ("id" SERIAL NOT NULL, "weekStartDate" TIMESTAMP, "weekEndDate" TIMESTAMP, "approvedBySupervisor" boolean, "approvedByClient" boolean, "resourceComment" character varying, "supervisorComment" character varying, "clientRepresentativeComment" character varying, "audited" boolean, "billed" boolean, "status" "public"."timesheet_entity_status_enum" NOT NULL DEFAULT 'NEW', "mondayHours" integer, "tuesdayHours" integer, "wednesdayHours" integer, "thursdayHours" integer, "fridayHours" integer, "saturdayHours" integer, "sundayHours" integer, "dateModified" TIMESTAMP, "resourceId" integer, "projectId" integer, "supervisorId" integer, CONSTRAINT "PK_fedda44571b7389362231d936bb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "approval_entity" ("id" SERIAL NOT NULL, "timesheetWeek" character varying, "submittedBy" character varying, "submissionDate" character varying, "time" character varying, "project" character varying, CONSTRAINT "PK_957000ac5492d83bf03e067a364" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "report_entity" ("reportId" SERIAL NOT NULL, "clientName" character varying, "projectName" character varying, "userName" character varying, "startDate" character varying, "month" integer, "year" integer, "hoursWorked" integer, "costRate" integer, "totalCost" integer, "billingRate" integer NOT NULL, "totalBilling" integer, CONSTRAINT "PK_a16e522c1dfcfd94caa18a41ef7" PRIMARY KEY ("reportId"))`);
        await queryRunner.query(`ALTER TABLE "project_resource_entity" ADD "costRate" integer`);
        await queryRunner.query(`ALTER TABLE "project_resource_entity" ADD "billRate" integer`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "supervisorId" integer`);
        await queryRunner.query(`ALTER TYPE "public"."user_entity_roles_enum" RENAME TO "user_entity_roles_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."user_entity_roles_enum" AS ENUM('ASSIGNED_RESOURCE', 'AVAILABLE_RESOURCE', 'BUSINESS_OWNER', 'SUPERVISOR', 'USER', 'CLIENT')`);
        await queryRunner.query(`ALTER TABLE "user_entity" ALTER COLUMN "roles" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user_entity" ALTER COLUMN "roles" TYPE "public"."user_entity_roles_enum"[] USING "roles"::"text"::"public"."user_entity_roles_enum"[]`);
        await queryRunner.query(`ALTER TABLE "user_entity" ALTER COLUMN "roles" SET DEFAULT '{USER}'`);
        await queryRunner.query(`DROP TYPE "public"."user_entity_roles_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."view_entity_updated_by_enum" RENAME TO "view_entity_updated_by_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."view_entity_updated_by_enum" AS ENUM('ASSIGNED_RESOURCE', 'AVAILABLE_RESOURCE', 'BUSINESS_OWNER', 'SUPERVISOR', 'USER', 'CLIENT')`);
        await queryRunner.query(`ALTER TABLE "view_entity" ALTER COLUMN "updated_by" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "view_entity" ALTER COLUMN "updated_by" TYPE "public"."view_entity_updated_by_enum" USING "updated_by"::"text"::"public"."view_entity_updated_by_enum"`);
        await queryRunner.query(`ALTER TABLE "view_entity" ALTER COLUMN "updated_by" SET DEFAULT 'USER'`);
        await queryRunner.query(`DROP TYPE "public"."view_entity_updated_by_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."view_entity_created_by_enum" RENAME TO "view_entity_created_by_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."view_entity_created_by_enum" AS ENUM('ASSIGNED_RESOURCE', 'AVAILABLE_RESOURCE', 'BUSINESS_OWNER', 'SUPERVISOR', 'USER', 'CLIENT')`);
        await queryRunner.query(`ALTER TABLE "view_entity" ALTER COLUMN "created_by" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "view_entity" ALTER COLUMN "created_by" TYPE "public"."view_entity_created_by_enum" USING "created_by"::"text"::"public"."view_entity_created_by_enum"`);
        await queryRunner.query(`ALTER TABLE "view_entity" ALTER COLUMN "created_by" SET DEFAULT 'USER'`);
        await queryRunner.query(`DROP TYPE "public"."view_entity_created_by_enum_old"`);
        await queryRunner.query(`ALTER TABLE "link_entity" ADD CONSTRAINT "UQ_9457468f6bf7dbf40ee7d1e4214" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TYPE "public"."link_entity_usertype_enum" RENAME TO "link_entity_usertype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."link_entity_usertype_enum" AS ENUM('ASSIGNED_RESOURCE', 'AVAILABLE_RESOURCE', 'BUSINESS_OWNER', 'SUPERVISOR', 'USER', 'CLIENT')`);
        await queryRunner.query(`ALTER TABLE "link_entity" ALTER COLUMN "userType" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "link_entity" ALTER COLUMN "userType" TYPE "public"."link_entity_usertype_enum" USING "userType"::"text"::"public"."link_entity_usertype_enum"`);
        await queryRunner.query(`ALTER TABLE "link_entity" ALTER COLUMN "userType" SET DEFAULT 'AVAILABLE_RESOURCE'`);
        await queryRunner.query(`DROP TYPE "public"."link_entity_usertype_enum_old"`);
        await queryRunner.query(`ALTER TABLE "timesheet_entity" ADD CONSTRAINT "FK_88f0a8baa69693e89ca24c78547" FOREIGN KEY ("resourceId") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "timesheet_entity" ADD CONSTRAINT "FK_d87b81839ef708ce6022ccef4a6" FOREIGN KEY ("projectId") REFERENCES "project_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "timesheet_entity" ADD CONSTRAINT "FK_b13b1410748edb858cc80afb017" FOREIGN KEY ("supervisorId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "timesheet_entity" DROP CONSTRAINT "FK_b13b1410748edb858cc80afb017"`);
        await queryRunner.query(`ALTER TABLE "timesheet_entity" DROP CONSTRAINT "FK_d87b81839ef708ce6022ccef4a6"`);
        await queryRunner.query(`ALTER TABLE "timesheet_entity" DROP CONSTRAINT "FK_88f0a8baa69693e89ca24c78547"`);
        await queryRunner.query(`CREATE TYPE "public"."link_entity_usertype_enum_old" AS ENUM('ASSIGNED_RESOURCE', 'AVAILABLE_RESOURCE', 'BUSINESS_OWNER', 'SUPERVISOR', 'USER')`);
        await queryRunner.query(`ALTER TABLE "link_entity" ALTER COLUMN "userType" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "link_entity" ALTER COLUMN "userType" TYPE "public"."link_entity_usertype_enum_old" USING "userType"::"text"::"public"."link_entity_usertype_enum_old"`);
        await queryRunner.query(`ALTER TABLE "link_entity" ALTER COLUMN "userType" SET DEFAULT 'AVAILABLE_RESOURCE'`);
        await queryRunner.query(`DROP TYPE "public"."link_entity_usertype_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."link_entity_usertype_enum_old" RENAME TO "link_entity_usertype_enum"`);
        await queryRunner.query(`ALTER TABLE "link_entity" DROP CONSTRAINT "UQ_9457468f6bf7dbf40ee7d1e4214"`);
        await queryRunner.query(`CREATE TYPE "public"."view_entity_created_by_enum_old" AS ENUM('ASSIGNED_RESOURCE', 'AVAILABLE_RESOURCE', 'BUSINESS_OWNER', 'SUPERVISOR', 'USER')`);
        await queryRunner.query(`ALTER TABLE "view_entity" ALTER COLUMN "created_by" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "view_entity" ALTER COLUMN "created_by" TYPE "public"."view_entity_created_by_enum_old" USING "created_by"::"text"::"public"."view_entity_created_by_enum_old"`);
        await queryRunner.query(`ALTER TABLE "view_entity" ALTER COLUMN "created_by" SET DEFAULT 'USER'`);
        await queryRunner.query(`DROP TYPE "public"."view_entity_created_by_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."view_entity_created_by_enum_old" RENAME TO "view_entity_created_by_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."view_entity_updated_by_enum_old" AS ENUM('ASSIGNED_RESOURCE', 'AVAILABLE_RESOURCE', 'BUSINESS_OWNER', 'SUPERVISOR', 'USER')`);
        await queryRunner.query(`ALTER TABLE "view_entity" ALTER COLUMN "updated_by" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "view_entity" ALTER COLUMN "updated_by" TYPE "public"."view_entity_updated_by_enum_old" USING "updated_by"::"text"::"public"."view_entity_updated_by_enum_old"`);
        await queryRunner.query(`ALTER TABLE "view_entity" ALTER COLUMN "updated_by" SET DEFAULT 'USER'`);
        await queryRunner.query(`DROP TYPE "public"."view_entity_updated_by_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."view_entity_updated_by_enum_old" RENAME TO "view_entity_updated_by_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."user_entity_roles_enum_old" AS ENUM('ASSIGNED_RESOURCE', 'AVAILABLE_RESOURCE', 'BUSINESS_OWNER', 'SUPERVISOR', 'USER')`);
        await queryRunner.query(`ALTER TABLE "user_entity" ALTER COLUMN "roles" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user_entity" ALTER COLUMN "roles" TYPE "public"."user_entity_roles_enum_old"[] USING "roles"::"text"::"public"."user_entity_roles_enum_old"[]`);
        await queryRunner.query(`ALTER TABLE "user_entity" ALTER COLUMN "roles" SET DEFAULT '{USER}'`);
        await queryRunner.query(`DROP TYPE "public"."user_entity_roles_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."user_entity_roles_enum_old" RENAME TO "user_entity_roles_enum"`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "supervisorId"`);
        await queryRunner.query(`ALTER TABLE "project_resource_entity" DROP COLUMN "billRate"`);
        await queryRunner.query(`ALTER TABLE "project_resource_entity" DROP COLUMN "costRate"`);
        await queryRunner.query(`DROP TABLE "report_entity"`);
        await queryRunner.query(`DROP TABLE "approval_entity"`);
        await queryRunner.query(`DROP TABLE "timesheet_entity"`);
        await queryRunner.query(`DROP TYPE "public"."timesheet_entity_status_enum"`);
        await queryRunner.query(`DROP TABLE "revised_timesheet_entity"`);
        await queryRunner.query(`DROP TABLE "calendar_entity"`);
    }

}
