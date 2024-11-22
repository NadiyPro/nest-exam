import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CarsBrandsEntity } from './cars_brands.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { CreateUpdateModel } from './models/date.model';
import { UserEntity } from './user.entity';

@Index(['cars_models'])
@Entity(TableNameEnum.CARS_MODELS)
export class CarsModelsEntity extends CreateUpdateModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cars_models: string;

  @Column()
  cars_brands_id: string;
  @ManyToOne(() => CarsBrandsEntity, (entity) => entity.brand_name)
  @JoinColumn({ name: 'cars_brands_id' })
  cars_brands_models: CarsBrandsEntity;

  @Column()
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.user_cars_brands_models)
  @JoinColumn({ name: 'user_id' })
  user_cars: UserEntity;
}
