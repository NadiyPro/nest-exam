import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBase1732385612335 implements MigrationInterface {
    name = 'AddBase1732385612335'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cars_brands" ("created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cars_brands" character varying NOT NULL, CONSTRAINT "PK_071d1ba30fca5741bb3eb2a1c65" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dealership" ("created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, CONSTRAINT "PK_7ae87d4c8bfcce755d19069f197" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "refresh_tokens" ("created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "refreshToken" text NOT NULL, "deviceId" text NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "phone" text NOT NULL, "accountType" text NOT NULL DEFAULT 'basic', "role" text NOT NULL DEFAULT 'seller', "dealership" text NOT NULL, "avatar" text, "deleted" TIMESTAMP, "dealership_id" uuid NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "UQ_e456a497674a1886ddbdc93228a" UNIQUE ("accountType"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_51b8b26ac168fbe7d6f5653e6c" ON "users" ("name") `);
        await queryRunner.query(`CREATE TABLE "cars_models" ("created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cars_models" character varying NOT NULL, "cars_brands_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_e7da0d7ec4be317491a9cb7ee68" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "advertisement" ("created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "price" double precision NOT NULL, "original_currency" text NOT NULL DEFAULT 'UAH', "courseUAH" double precision NOT NULL, "courseUSD" double precision NOT NULL, "courseEUR" double precision NOT NULL, "priceUAH" double precision NOT NULL, "priceUSD" double precision NOT NULL, "priceEUR" double precision NOT NULL, "region" text NOT NULL, "image_cars" text NOT NULL, "isValid" text NOT NULL DEFAULT 'active', "text_advertisement" text NOT NULL, "user_id" uuid NOT NULL, "cars_brands_models_id" uuid NOT NULL, "dealership_id" uuid NOT NULL, CONSTRAINT "REL_57aa1977e1e39aeee824dffff6" UNIQUE ("cars_brands_models_id"), CONSTRAINT "PK_c8486834e5ef704ec05b7564d89" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "statistics" ("created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "views_all" integer NOT NULL, "views_day" integer NOT NULL, "views_week" integer NOT NULL, "views_month" integer NOT NULL, "ave_price_region" double precision NOT NULL, "ave_price_Ukraine" double precision NOT NULL, "user_id" uuid NOT NULL, "advertisement_id" uuid NOT NULL, CONSTRAINT "REL_0cdc7b42ed967e68277c73da51" UNIQUE ("advertisement_id"), CONSTRAINT "PK_c3769cca342381fa827a0f246a7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_e55a019c00e72ac8b9e13d6f2fd" FOREIGN KEY ("dealership_id") REFERENCES "dealership"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cars_models" ADD CONSTRAINT "FK_4e3feaa130ac96f7d2c29cb39e4" FOREIGN KEY ("cars_brands_id") REFERENCES "cars_brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cars_models" ADD CONSTRAINT "FK_db77fdf8c959af7a0cd6a4d7b68" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "advertisement" ADD CONSTRAINT "FK_1c55264f46f9b1accd4eff08ed6" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "advertisement" ADD CONSTRAINT "FK_57aa1977e1e39aeee824dffff6c" FOREIGN KEY ("cars_brands_models_id") REFERENCES "cars_models"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "advertisement" ADD CONSTRAINT "FK_590fb6fd854fc039bca8eebaee5" FOREIGN KEY ("dealership_id") REFERENCES "dealership"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "statistics" ADD CONSTRAINT "FK_62fa61febb58e0ef44ef3cfec1a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "statistics" ADD CONSTRAINT "FK_0cdc7b42ed967e68277c73da51e" FOREIGN KEY ("advertisement_id") REFERENCES "advertisement"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "statistics" DROP CONSTRAINT "FK_0cdc7b42ed967e68277c73da51e"`);
        await queryRunner.query(`ALTER TABLE "statistics" DROP CONSTRAINT "FK_62fa61febb58e0ef44ef3cfec1a"`);
        await queryRunner.query(`ALTER TABLE "advertisement" DROP CONSTRAINT "FK_590fb6fd854fc039bca8eebaee5"`);
        await queryRunner.query(`ALTER TABLE "advertisement" DROP CONSTRAINT "FK_57aa1977e1e39aeee824dffff6c"`);
        await queryRunner.query(`ALTER TABLE "advertisement" DROP CONSTRAINT "FK_1c55264f46f9b1accd4eff08ed6"`);
        await queryRunner.query(`ALTER TABLE "cars_models" DROP CONSTRAINT "FK_db77fdf8c959af7a0cd6a4d7b68"`);
        await queryRunner.query(`ALTER TABLE "cars_models" DROP CONSTRAINT "FK_4e3feaa130ac96f7d2c29cb39e4"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_e55a019c00e72ac8b9e13d6f2fd"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4"`);
        await queryRunner.query(`DROP TABLE "statistics"`);
        await queryRunner.query(`DROP TABLE "advertisement"`);
        await queryRunner.query(`DROP TABLE "cars_models"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_51b8b26ac168fbe7d6f5653e6c"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "refresh_tokens"`);
        await queryRunner.query(`DROP TABLE "dealership"`);
        await queryRunner.query(`DROP TABLE "cars_brands"`);
    }

}
