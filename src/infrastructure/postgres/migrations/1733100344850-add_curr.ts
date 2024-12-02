import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCurr1733100344850 implements MigrationInterface {
    name = 'AddCurr1733100344850'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "advertisement" DROP COLUMN "original_currency"`);
        await queryRunner.query(`CREATE TYPE "public"."advertisement_original_currency_enum" AS ENUM('USD', 'EUR', 'UAH')`);
        await queryRunner.query(`ALTER TABLE "advertisement" ADD "original_currency" "public"."advertisement_original_currency_enum" NOT NULL DEFAULT 'UAH'`);
        await queryRunner.query(`ALTER TABLE "advertisement" DROP COLUMN "isValid"`);
        await queryRunner.query(`CREATE TYPE "public"."advertisement_isvalid_enum" AS ENUM('pending', 'active', 'inactive')`);
        await queryRunner.query(`ALTER TABLE "advertisement" ADD "isValid" "public"."advertisement_isvalid_enum" NOT NULL DEFAULT 'pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "advertisement" DROP COLUMN "isValid"`);
        await queryRunner.query(`DROP TYPE "public"."advertisement_isvalid_enum"`);
        await queryRunner.query(`ALTER TABLE "advertisement" ADD "isValid" text NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "advertisement" DROP COLUMN "original_currency"`);
        await queryRunner.query(`DROP TYPE "public"."advertisement_original_currency_enum"`);
        await queryRunner.query(`ALTER TABLE "advertisement" ADD "original_currency" text NOT NULL DEFAULT 'UAH'`);
    }

}
