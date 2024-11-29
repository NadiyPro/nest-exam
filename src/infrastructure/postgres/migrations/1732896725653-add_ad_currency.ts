import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAdCurrency1732896725653 implements MigrationInterface {
    name = 'AddAdCurrency1732896725653'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "advertisement" DROP COLUMN "currencyUAH"`);
        await queryRunner.query(`ALTER TABLE "advertisement" DROP COLUMN "currencyUSD"`);
        await queryRunner.query(`ALTER TABLE "advertisement" DROP COLUMN "currencyEUR"`);
        await queryRunner.query(`ALTER TABLE "advertisement" ADD "curBuyingUSD" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "advertisement" ADD "curSalesUSD" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "advertisement" ADD "curBuyingEUR" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "advertisement" ADD "curSalesEUR" double precision NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "advertisement" DROP COLUMN "curSalesEUR"`);
        await queryRunner.query(`ALTER TABLE "advertisement" DROP COLUMN "curBuyingEUR"`);
        await queryRunner.query(`ALTER TABLE "advertisement" DROP COLUMN "curSalesUSD"`);
        await queryRunner.query(`ALTER TABLE "advertisement" DROP COLUMN "curBuyingUSD"`);
        await queryRunner.query(`ALTER TABLE "advertisement" ADD "currencyEUR" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "advertisement" ADD "currencyUSD" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "advertisement" ADD "currencyUAH" double precision NOT NULL`);
    }

}
