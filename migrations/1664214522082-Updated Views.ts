import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdatedViews1664214522082 implements MigrationInterface {
    name = 'UpdatedViews1664214522082'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "revision_entity" DROP CONSTRAINT "FK_840ccd6b9cc6de8a1b468b57e54"`);
        await queryRunner.query(`ALTER TABLE "revision_entity" DROP CONSTRAINT "FK_efc0aa4d3a4c4c318e9873eae86"`);
        await queryRunner.query(`ALTER TABLE "revision_entity" DROP CONSTRAINT "REL_840ccd6b9cc6de8a1b468b57e5"`);
        await queryRunner.query(`ALTER TABLE "revision_entity" DROP COLUMN "viewId"`);
        await queryRunner.query(`ALTER TABLE "revision_entity" DROP CONSTRAINT "REL_efc0aa4d3a4c4c318e9873eae8"`);
        await queryRunner.query(`ALTER TABLE "revision_entity" DROP COLUMN "newViewId"`);
        await queryRunner.query(`ALTER TABLE "view_entity" ADD "revisionId" integer`);
        await queryRunner.query(`ALTER TABLE "view_entity" ADD CONSTRAINT "FK_458e6aa9316cac59ee8ce98b50c" FOREIGN KEY ("revisionId") REFERENCES "revision_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "view_entity" DROP CONSTRAINT "FK_458e6aa9316cac59ee8ce98b50c"`);
        await queryRunner.query(`ALTER TABLE "view_entity" DROP COLUMN "revisionId"`);
        await queryRunner.query(`ALTER TABLE "revision_entity" ADD "newViewId" integer`);
        await queryRunner.query(`ALTER TABLE "revision_entity" ADD CONSTRAINT "REL_efc0aa4d3a4c4c318e9873eae8" UNIQUE ("newViewId")`);
        await queryRunner.query(`ALTER TABLE "revision_entity" ADD "viewId" integer`);
        await queryRunner.query(`ALTER TABLE "revision_entity" ADD CONSTRAINT "REL_840ccd6b9cc6de8a1b468b57e5" UNIQUE ("viewId")`);
        await queryRunner.query(`ALTER TABLE "revision_entity" ADD CONSTRAINT "FK_efc0aa4d3a4c4c318e9873eae86" FOREIGN KEY ("newViewId") REFERENCES "view_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "revision_entity" ADD CONSTRAINT "FK_840ccd6b9cc6de8a1b468b57e54" FOREIGN KEY ("viewId") REFERENCES "view_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
