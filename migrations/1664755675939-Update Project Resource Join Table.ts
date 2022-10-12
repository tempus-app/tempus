import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateProjectResourceJoinTable1664755675939 implements MigrationInterface {
    name = 'UpdateProjectResourceJoinTable1664755675939'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "project_resource_entity" ("id" SERIAL NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "email" character varying NOT NULL, "resourceId" integer NOT NULL, "projectId" integer NOT NULL, CONSTRAINT "PK_370259d8777a74f53939a387841" PRIMARY KEY ("id", "resourceId", "projectId"))`);
        await queryRunner.query(`ALTER TABLE "project_resource_entity" ADD CONSTRAINT "FK_dfe82dc756c5464b129a5781438" FOREIGN KEY ("resourceId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_resource_entity" ADD CONSTRAINT "FK_553b88b282a5595c21263e4d543" FOREIGN KEY ("projectId") REFERENCES "project_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_resource_entity" DROP CONSTRAINT "FK_553b88b282a5595c21263e4d543"`);
        await queryRunner.query(`ALTER TABLE "project_resource_entity" DROP CONSTRAINT "FK_dfe82dc756c5464b129a5781438"`);
        await queryRunner.query(`DROP TABLE "project_resource_entity"`);
    }

}
