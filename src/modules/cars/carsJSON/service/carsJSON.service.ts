import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import { DataSource } from 'typeorm';

import { CarsBrandsEntity } from '../../../../infrastructure/postgres/entities/cars_brands.entity';
import { CarsModelsEntity } from '../../../../infrastructure/postgres/entities/cars_models.entity';
import { CreateCarsReqDto } from '../../models/dto/req/create_cars.req.dto';

@Injectable()
export class CarsJSONService implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}

  onModuleInit(): void {}

  private readJSON(): {
    cars: CreateCarsReqDto[];
    // cars: { brands_name: string; models_name: string[] }[];
  } {
    const filePath =
      'C:/Users/User/nest-exam/src/modules/cars/carsJSON/cars.json';
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  }

  public async importCarsJSON(userId: string): Promise<void> {
    const data = this.readJSON();

    const qb = this.dataSource.createQueryRunner();
    await qb.connect();
    await qb.startTransaction();

    try {
      for (const car of data.cars) {
        let brand = await qb.manager.findOne(CarsBrandsEntity, {
          where: { brands_name: car.brands_name },
        });

        if (!brand) {
          brand = qb.manager.create(CarsBrandsEntity, {
            brands_name: car.brands_name,
            user_id: userId,
          });
          await qb.manager.save(brand);
        }

        for (const model of car.models_name) {
          const models = await qb.manager.findOne(CarsModelsEntity, {
            where: { models_name: model, brands_id: brand.brands_id },
          });

          if (!models) {
            const newModel = qb.manager.create(CarsModelsEntity, {
              models_name: model,
              brands_id: brand.brands_id,
              user_id: userId,
            });
            await qb.manager.save(newModel);
          }
        }
      }

      await qb.commitTransaction();
    } catch (error) {
      await qb.rollbackTransaction();
      throw error;
    } finally {
      await qb.release();
    }
  }
}
