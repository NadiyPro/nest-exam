import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBaseDealishipIdNull1732389231731 implements MigrationInterface {
    name = 'AddBaseDealishipIdNull1732389231731'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_e55a019c00e72ac8b9e13d6f2fd"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "dealership_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_e55a019c00e72ac8b9e13d6f2fd" FOREIGN KEY ("dealership_id") REFERENCES "dealership"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_e55a019c00e72ac8b9e13d6f2fd"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "dealership_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_e55a019c00e72ac8b9e13d6f2fd" FOREIGN KEY ("dealership_id") REFERENCES "dealership"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
