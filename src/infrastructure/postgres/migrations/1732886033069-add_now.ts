import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNow1732886033069 implements MigrationInterface {
    name = 'AddNow1732886033069'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cars_brands" ("created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "brands_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "brands_name" text NOT NULL, "deleted" TIMESTAMP, "user_id" uuid NOT NULL, CONSTRAINT "PK_a3435f870401959e99ece21ac06" PRIMARY KEY ("brands_id"))`);
        await queryRunner.query(`CREATE TABLE "cars_models" ("created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "models_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "models_name" text NOT NULL, "brands_id" uuid NOT NULL, "deleted" TIMESTAMP, "user_id" uuid NOT NULL, CONSTRAINT "PK_fff672e3ab4f8268e0f946d27cb" PRIMARY KEY ("models_id"))`);
        await queryRunner.query(`CREATE TABLE "dealership" ("created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, CONSTRAINT "PK_7ae87d4c8bfcce755d19069f197" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "statistics" ("created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "views_all" integer NOT NULL, "views_day" integer NOT NULL, "views_week" integer NOT NULL, "views_month" integer NOT NULL, "ave_price_region" double precision NOT NULL, "ave_price_Ukraine" double precision NOT NULL, "user_id" uuid NOT NULL, "advertisement_id" uuid NOT NULL, CONSTRAINT "REL_0cdc7b42ed967e68277c73da51" UNIQUE ("advertisement_id"), CONSTRAINT "PK_c3769cca342381fa827a0f246a7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "advertisement" ("created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "price" double precision NOT NULL, "original_currency" text NOT NULL DEFAULT 'UAH', "courseUAH" double precision NOT NULL, "courseUSD" double precision NOT NULL, "courseEUR" double precision NOT NULL, "priceUAH" double precision NOT NULL, "priceUSD" double precision NOT NULL, "priceEUR" double precision NOT NULL, "region" text NOT NULL, "image_cars" text NOT NULL, "isValid" text NOT NULL DEFAULT 'active', "text_advertisement" text NOT NULL, "user_id" uuid NOT NULL, "cars_brands_models_id" uuid NOT NULL, "dealership_id" uuid NOT NULL, CONSTRAINT "REL_57aa1977e1e39aeee824dffff6" UNIQUE ("cars_brands_models_id"), CONSTRAINT "PK_c8486834e5ef704ec05b7564d89" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "refresh_tokens" ("created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "refreshToken" text NOT NULL, "deviceId" text NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('buyer', 'seller', 'manager', 'admin')`);
        await queryRunner.query(`CREATE TABLE "users" ("created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "phone" text NOT NULL, "accountType" text NOT NULL DEFAULT 'basic', "role" "public"."users_role_enum" NOT NULL DEFAULT 'buyer', "dealership" text, "avatar" text, "deleted" TIMESTAMP, "dealership_id" uuid, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_51b8b26ac168fbe7d6f5653e6c" ON "users" ("name") `);
        await queryRunner.query(`ALTER TABLE "cars_brands" ADD CONSTRAINT "FK_ab80b2b3a13473016d714f7de38" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cars_models" ADD CONSTRAINT "FK_eb87ce672c0a9bdde2c54224e4e" FOREIGN KEY ("brands_id") REFERENCES "cars_brands"("brands_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cars_models" ADD CONSTRAINT "FK_db77fdf8c959af7a0cd6a4d7b68" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "statistics" ADD CONSTRAINT "FK_62fa61febb58e0ef44ef3cfec1a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "statistics" ADD CONSTRAINT "FK_0cdc7b42ed967e68277c73da51e" FOREIGN KEY ("advertisement_id") REFERENCES "advertisement"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "advertisement" ADD CONSTRAINT "FK_1c55264f46f9b1accd4eff08ed6" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "advertisement" ADD CONSTRAINT "FK_57aa1977e1e39aeee824dffff6c" FOREIGN KEY ("cars_brands_models_id") REFERENCES "cars_models"("models_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "advertisement" ADD CONSTRAINT "FK_590fb6fd854fc039bca8eebaee5" FOREIGN KEY ("dealership_id") REFERENCES "dealership"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_e55a019c00e72ac8b9e13d6f2fd" FOREIGN KEY ("dealership_id") REFERENCES "dealership"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_e55a019c00e72ac8b9e13d6f2fd"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4"`);
        await queryRunner.query(`ALTER TABLE "advertisement" DROP CONSTRAINT "FK_590fb6fd854fc039bca8eebaee5"`);
        await queryRunner.query(`ALTER TABLE "advertisement" DROP CONSTRAINT "FK_57aa1977e1e39aeee824dffff6c"`);
        await queryRunner.query(`ALTER TABLE "advertisement" DROP CONSTRAINT "FK_1c55264f46f9b1accd4eff08ed6"`);
        await queryRunner.query(`ALTER TABLE "statistics" DROP CONSTRAINT "FK_0cdc7b42ed967e68277c73da51e"`);
        await queryRunner.query(`ALTER TABLE "statistics" DROP CONSTRAINT "FK_62fa61febb58e0ef44ef3cfec1a"`);
        await queryRunner.query(`ALTER TABLE "cars_models" DROP CONSTRAINT "FK_db77fdf8c959af7a0cd6a4d7b68"`);
        await queryRunner.query(`ALTER TABLE "cars_models" DROP CONSTRAINT "FK_eb87ce672c0a9bdde2c54224e4e"`);
        await queryRunner.query(`ALTER TABLE "cars_brands" DROP CONSTRAINT "FK_ab80b2b3a13473016d714f7de38"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_51b8b26ac168fbe7d6f5653e6c"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "refresh_tokens"`);
        await queryRunner.query(`DROP TABLE "advertisement"`);
        await queryRunner.query(`DROP TABLE "statistics"`);
        await queryRunner.query(`DROP TABLE "dealership"`);
        await queryRunner.query(`DROP TABLE "cars_models"`);
        await queryRunner.query(`DROP TABLE "cars_brands"`);
    }

}
