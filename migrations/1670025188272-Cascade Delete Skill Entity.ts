import {MigrationInterface, QueryRunner} from "typeorm";

export class CascadeDeleteSkillEntity1670025188272 implements MigrationInterface {
    name = 'CascadeDeleteSkillEntity1670025188272'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "skill_entity" DROP CONSTRAINT "FK_681d564eb2b4a7c45435407b2e1"`);
        await queryRunner.query(`ALTER TABLE "skill_entity" ADD CONSTRAINT "FK_681d564eb2b4a7c45435407b2e1" FOREIGN KEY ("resourceId") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "skill_entity" DROP CONSTRAINT "FK_681d564eb2b4a7c45435407b2e1"`);
        await queryRunner.query(`ALTER TABLE "skill_entity" ADD CONSTRAINT "FK_681d564eb2b4a7c45435407b2e1" FOREIGN KEY ("resourceId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
