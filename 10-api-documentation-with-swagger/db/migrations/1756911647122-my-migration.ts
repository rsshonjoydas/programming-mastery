import { MigrationInterface, QueryRunner } from "typeorm";

export class MyMigration1756911647122 implements MigrationInterface {
    name = 'MyMigration1756911647122'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "phone" character varying NOT NULL`);
    }

}
