import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CarsModelsEntity } from './cars_models.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { CreateUpdateModel } from './models/date.model';

@Entity(TableNameEnum.CARS_BRANDS)
export class CarsBrandsEntity extends CreateUpdateModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cars_brands: string;

  @OneToMany(() => CarsModelsEntity, (entity) => entity.cars_models)
  brand_name: CarsModelsEntity[];
}
