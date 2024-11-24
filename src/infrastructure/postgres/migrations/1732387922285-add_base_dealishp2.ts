import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBaseDealishp21732387922285 implements MigrationInterface {
    name = 'AddBaseDealishp21732387922285'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "dealership" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "dealership"`);
    }

}
