import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBaseDealiship1732386793884 implements MigrationInterface {
    name = 'AddBaseDealiship1732386793884'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "dealership"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "dealership" text NOT NULL`);
    }

}
