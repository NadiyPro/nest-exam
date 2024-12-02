import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAdNotBrandnpm1733083044077 implements MigrationInterface {
    name = 'AddAdNotBrandnpm1733083044077'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "advertisement" ALTER COLUMN "isValid" SET DEFAULT 'pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "advertisement" ALTER COLUMN "isValid" SET DEFAULT 'active'`);
    }

}
