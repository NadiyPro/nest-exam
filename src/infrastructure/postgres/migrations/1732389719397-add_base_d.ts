import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBaseD1732389719397 implements MigrationInterface {
    name = 'AddBaseD1732389719397'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "dealership" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "dealership" SET NOT NULL`);
    }

}
