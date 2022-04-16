import {MigrationInterface, QueryRunner} from "typeorm";

export class AddConstraints1649979564715 implements MigrationInterface {
    name = 'AddConstraints1649979564715'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "skill_entity" DROP CONSTRAINT "FK_4188b06c3ce5cbf5db98e7f2de8"`);
        await queryRunner.query(`ALTER TABLE "skill_type_entity" ADD CONSTRAINT "UQ_9573cdb8b65435a179b3fa1c10b" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "education_entity" ADD CONSTRAINT "CHK_c4512f85171c7c41ee707bf4f2" CHECK ("endDate" >= "startDate")`);
        await queryRunner.query(`ALTER TABLE "experience_entity" ADD CONSTRAINT "CHK_15be173a18dfdc439cb7a899cc" CHECK ("endDate" >= "startDate")`);
        await queryRunner.query(`ALTER TABLE "project_entity" ADD CONSTRAINT "CHK_f3984456bd34b07f681f7b6d66" CHECK ("endDate" >= "startDate")`);
        await queryRunner.query(`ALTER TABLE "skill_entity" ADD CONSTRAINT "FK_4188b06c3ce5cbf5db98e7f2de8" FOREIGN KEY ("skill_key") REFERENCES "skill_type_entity"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "skill_entity" DROP CONSTRAINT "FK_4188b06c3ce5cbf5db98e7f2de8"`);
        await queryRunner.query(`ALTER TABLE "project_entity" DROP CONSTRAINT "CHK_f3984456bd34b07f681f7b6d66"`);
        await queryRunner.query(`ALTER TABLE "experience_entity" DROP CONSTRAINT "CHK_15be173a18dfdc439cb7a899cc"`);
        await queryRunner.query(`ALTER TABLE "education_entity" DROP CONSTRAINT "CHK_c4512f85171c7c41ee707bf4f2"`);
        await queryRunner.query(`ALTER TABLE "skill_type_entity" DROP CONSTRAINT "UQ_9573cdb8b65435a179b3fa1c10b"`);
        await queryRunner.query(`ALTER TABLE "skill_entity" ADD CONSTRAINT "FK_4188b06c3ce5cbf5db98e7f2de8" FOREIGN KEY ("skill_key") REFERENCES "skill_type_entity"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
