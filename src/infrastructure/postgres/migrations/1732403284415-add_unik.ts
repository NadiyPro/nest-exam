import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUnik1732403284415 implements MigrationInterface {
    name = 'AddUnik1732403284415'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_e456a497674a1886ddbdc93228a"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_e456a497674a1886ddbdc93228a" UNIQUE ("accountType")`);
    }

}
