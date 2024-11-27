import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBrandsNameColumn1732732266366 implements MigrationInterface {
    name = 'AddBrandsNameColumn1732732266366'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cars_models" DROP CONSTRAINT "FK_4e3feaa130ac96f7d2c29cb39e4"`);
        await queryRunner.query(`ALTER TABLE "cars_brands" DROP COLUMN "cars_brands"`);
        await queryRunner.query(`ALTER TABLE "cars_models" DROP COLUMN "cars_models"`);
        await queryRunner.query(`ALTER TABLE "cars_models" DROP COLUMN "cars_brands_id"`);
        await queryRunner.query(`ALTER TABLE "cars_brands" ADD "brands_name" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cars_brands" ADD CONSTRAINT "UQ_a3cb34ae001d156f206191e6c99" UNIQUE ("brands_name")`);
        await queryRunner.query(`ALTER TABLE "cars_brands" ADD "deleted" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "cars_brands" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cars_models" ADD "models_name" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cars_models" ADD CONSTRAINT "UQ_4654beae3fcfa45e3c8cc1d9af1" UNIQUE ("models_name")`);
        await queryRunner.query(`ALTER TABLE "cars_models" ADD "brands_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cars_models" ADD "deleted" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('buyer', 'seller', 'manager', 'admin')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role" "public"."users_role_enum" NOT NULL DEFAULT 'buyer'`);
        await queryRunner.query(`ALTER TABLE "cars_brands" ADD CONSTRAINT "FK_ab80b2b3a13473016d714f7de38" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cars_models" ADD CONSTRAINT "FK_eb87ce672c0a9bdde2c54224e4e" FOREIGN KEY ("brands_id") REFERENCES "cars_brands"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cars_models" DROP CONSTRAINT "FK_eb87ce672c0a9bdde2c54224e4e"`);
        await queryRunner.query(`ALTER TABLE "cars_brands" DROP CONSTRAINT "FK_ab80b2b3a13473016d714f7de38"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role" text NOT NULL DEFAULT 'seller'`);
        await queryRunner.query(`ALTER TABLE "cars_models" DROP COLUMN "deleted"`);
        await queryRunner.query(`ALTER TABLE "cars_models" DROP COLUMN "brands_id"`);
        await queryRunner.query(`ALTER TABLE "cars_models" DROP CONSTRAINT "UQ_4654beae3fcfa45e3c8cc1d9af1"`);
        await queryRunner.query(`ALTER TABLE "cars_models" DROP COLUMN "models_name"`);
        await queryRunner.query(`ALTER TABLE "cars_brands" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "cars_brands" DROP COLUMN "deleted"`);
        await queryRunner.query(`ALTER TABLE "cars_brands" DROP CONSTRAINT "UQ_a3cb34ae001d156f206191e6c99"`);
        await queryRunner.query(`ALTER TABLE "cars_brands" DROP COLUMN "brands_name"`);
        await queryRunner.query(`ALTER TABLE "cars_models" ADD "cars_brands_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cars_models" ADD "cars_models" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cars_brands" ADD "cars_brands" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cars_models" ADD CONSTRAINT "FK_4e3feaa130ac96f7d2c29cb39e4" FOREIGN KEY ("cars_brands_id") REFERENCES "cars_brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
