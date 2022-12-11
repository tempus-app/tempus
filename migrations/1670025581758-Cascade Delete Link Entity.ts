import {MigrationInterface, QueryRunner} from "typeorm";

export class CascadeDeleteLinkEntity1670025581758 implements MigrationInterface {
    name = 'CascadeDeleteLinkEntity1670025581758'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link_entity" DROP CONSTRAINT "FK_3fae39782976ac5f7b77e10286c"`);
        await queryRunner.query(`ALTER TABLE "link_entity" ADD CONSTRAINT "FK_3fae39782976ac5f7b77e10286c" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link_entity" DROP CONSTRAINT "FK_3fae39782976ac5f7b77e10286c"`);
        await queryRunner.query(`ALTER TABLE "link_entity" ADD CONSTRAINT "FK_3fae39782976ac5f7b77e10286c" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
