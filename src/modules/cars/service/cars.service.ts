import { ConflictException, Injectable } from '@nestjs/common';

import { CarsBrandsEntity } from '../../../infrastructure/postgres/entities/cars_brands.entity';
import { CarsModelsEntity } from '../../../infrastructure/postgres/entities/cars_models.entity';
import { CarsBrandsRepository } from '../../../infrastructure/repository/services/cars_brands.repository';
import { CarsModelsRepository } from '../../../infrastructure/repository/services/cars_models.repository';
import { IUserData } from '../../auth/models/interfaces/user_data.interface';
import { CreateCarsReqDto } from '../models/dto/req/create_cars.req.dto';
import { ListCarsQueryReqDto } from '../models/dto/req/list-cars-query.req.dto';
// import { CarsDeletedResDto } from '../models/dto/res/cars.deleted.res.dto';
import { CarsResDto } from '../models/dto/res/cars.res.dto';
import { CarsMapper } from './cars.mapper';

@Injectable()
export class CarsService {
  constructor(
    private readonly carsBrandsRepository: CarsBrandsRepository,
    private readonly carsModelsRepository: CarsModelsRepository,
  ) {}

  public async createCars(
    userData: IUserData,
    dto: CreateCarsReqDto,
  ): Promise<CarsResDto> {
    const new_brand = await this.carsBrandsRepository.save(
      this.carsBrandsRepository.create({
        brands_name: dto.brands_name,
        user_id: userData.userId,
      }),
    );

    const new_model = await this.carsModelsRepository.save(
      this.carsModelsRepository.create({
        models_name: dto.models_name,
        brands_id: new_brand.brands_id,
        user_id: userData.userId,
      }),
    );
    return CarsMapper.toResCreateDto(new_model, new_brand);
  }

  public async findAllBrands(
    query: ListCarsQueryReqDto,
  ): Promise<[CarsBrandsEntity[], number]> {
    return await this.carsBrandsRepository.findAllBrands(query);
  }

  public async findAllModel(
    query: ListCarsQueryReqDto,
  ): Promise<[CarsModelsEntity[], number]> {
    return await this.carsModelsRepository.findAllModels(query);
  }

  public async findAllCars(
    query: ListCarsQueryReqDto,
  ): Promise<[CarsBrandsEntity[], number]> {
    const [entities, total] =
      await this.carsBrandsRepository.findAllCars(query);
    return [entities, total];
  }

  public async updateCars(
    brands_id: string,
    dto: CreateCarsReqDto,
  ): Promise<CarsResDto> {
    const cars_brands = await this.carsBrandsRepository.findOneBy({
      brands_id: brands_id,
    });
    if (!cars_brands) {
      throw new ConflictException('The specified brand does not exist');
    }
    cars_brands.brands_name = dto.brands_name;
    await this.carsBrandsRepository.save(cars_brands);

    const cars_model = await this.carsModelsRepository.findOneBy({
      brands_id: brands_id,
    });
    if (!cars_model) {
      throw new ConflictException('The specified model does not exist');
    }
    cars_model.models_name = dto.models_name;
    await this.carsModelsRepository.save(cars_model);

    return CarsMapper.toResCreateDto(cars_model, cars_brands);
  }

  public async deleteCars(brands_id: string): Promise<string> {
    const cars_brands = await this.carsBrandsRepository.findOneBy({
      brands_id,
    });
    if (!cars_brands) {
      throw new ConflictException('The specified brand does not exist');
    }
    await this.carsModelsRepository.delete({ brands_id });
    await this.carsBrandsRepository.delete({ brands_id });
    return 'Auto deleted successfully';
  }
}
