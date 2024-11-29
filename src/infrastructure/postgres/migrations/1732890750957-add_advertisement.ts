import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAdvertisement1732890750957 implements MigrationInterface {
    name = 'AddAdvertisement1732890750957'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "advertisement" DROP COLUMN "courseUAH"`);
        await queryRunner.query(`ALTER TABLE "advertisement" DROP COLUMN "courseUSD"`);
        await queryRunner.query(`ALTER TABLE "advertisement" DROP COLUMN "courseEUR"`);
        await queryRunner.query(`ALTER TABLE "advertisement" ADD "currencyUAH" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "advertisement" ADD "currencyUSD" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "advertisement" ADD "currencyEUR" double precision NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "advertisement" DROP COLUMN "currencyEUR"`);
        await queryRunner.query(`ALTER TABLE "advertisement" DROP COLUMN "currencyUSD"`);
        await queryRunner.query(`ALTER TABLE "advertisement" DROP COLUMN "currencyUAH"`);
        await queryRunner.query(`ALTER TABLE "advertisement" ADD "courseEUR" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "advertisement" ADD "courseUSD" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "advertisement" ADD "courseUAH" double precision NOT NULL`);
    }

}
