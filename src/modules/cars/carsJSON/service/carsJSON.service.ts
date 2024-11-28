import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import { DataSource } from 'typeorm';

import { CarsBrandsEntity } from '../../../../infrastructure/postgres/entities/cars_brands.entity';
import { CarsModelsEntity } from '../../../../infrastructure/postgres/entities/cars_models.entity';

@Injectable()
export class CarsJSONService implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}

  onModuleInit(): void {}

  private readJSON(): {
    cars: { cars_brands: string; cars_models: string[] }[];
  } {
    const filePath =
      'C:/Users/User/nest-exam/src/modules/cars/carsJSON/cars.json';
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  }

  public async importCarsJSON(userId: string): Promise<void> {
    const data = this.readJSON();

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const car of data.cars) {
        let brand = await queryRunner.manager.findOne(CarsBrandsEntity, {
          where: { brands_name: car.cars_brands },
        });

        if (!brand) {
          brand = queryRunner.manager.create(CarsBrandsEntity, {
            brands_name: car.cars_brands,
            user_id: userId,
          });
          await queryRunner.manager.save(brand);
        }

        for (const model of car.cars_models) {
          const existingModel = await queryRunner.manager.findOne(
            CarsModelsEntity,
            {
              where: { models_name: model, brands_id: brand.brands_id },
            },
          );

          if (!existingModel) {
            const newModel = queryRunner.manager.create(CarsModelsEntity, {
              models_name: model,
              brands_id: brand.brands_id,
              user_id: userId,
            });
            await queryRunner.manager.save(newModel);
          }
        }
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
