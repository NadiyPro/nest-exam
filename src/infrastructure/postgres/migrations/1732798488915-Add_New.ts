import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNew1732798488915 implements MigrationInterface {
    name = 'AddNew1732798488915'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cars_models" DROP CONSTRAINT "UQ_4654beae3fcfa45e3c8cc1d9af1"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cars_models" ADD CONSTRAINT "UQ_4654beae3fcfa45e3c8cc1d9af1" UNIQUE ("models_name")`);
    }

}
