import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCascadeDeleteOnJoinProjectResourceTable1664843755036 implements MigrationInterface {
    name = 'AddCascadeDeleteOnJoinProjectResourceTable1664843755036'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_resource_entity" DROP CONSTRAINT "FK_553b88b282a5595c21263e4d543"`);
        await queryRunner.query(`ALTER TABLE "project_resource_entity" DROP CONSTRAINT "FK_dfe82dc756c5464b129a5781438"`);
        await queryRunner.query(`ALTER TABLE "client_representative_entity" DROP CONSTRAINT "FK_6a026db3b1ae4e35e53b46ae4fb"`);
        await queryRunner.query(`ALTER TABLE "project_resource_entity" ADD CONSTRAINT "FK_dfe82dc756c5464b129a5781438" FOREIGN KEY ("resourceId") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_resource_entity" ADD CONSTRAINT "FK_553b88b282a5595c21263e4d543" FOREIGN KEY ("projectId") REFERENCES "project_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client_representative_entity" ADD CONSTRAINT "FK_6a026db3b1ae4e35e53b46ae4fb" FOREIGN KEY ("clientId") REFERENCES "client_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_representative_entity" DROP CONSTRAINT "FK_6a026db3b1ae4e35e53b46ae4fb"`);
        await queryRunner.query(`ALTER TABLE "project_resource_entity" DROP CONSTRAINT "FK_553b88b282a5595c21263e4d543"`);
        await queryRunner.query(`ALTER TABLE "project_resource_entity" DROP CONSTRAINT "FK_dfe82dc756c5464b129a5781438"`);
        await queryRunner.query(`ALTER TABLE "client_representative_entity" ADD CONSTRAINT "FK_6a026db3b1ae4e35e53b46ae4fb" FOREIGN KEY ("clientId") REFERENCES "client_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_resource_entity" ADD CONSTRAINT "FK_dfe82dc756c5464b129a5781438" FOREIGN KEY ("resourceId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_resource_entity" ADD CONSTRAINT "FK_553b88b282a5595c21263e4d543" FOREIGN KEY ("projectId") REFERENCES "project_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
