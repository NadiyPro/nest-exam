import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CarsBrandsEntity } from './cars_brands.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { CreateUpdateModel } from './models/date.model';
import { UserEntity } from './user.entity';

@Entity(TableNameEnum.CARS_MODELS)
export class CarsModelsEntity extends CreateUpdateModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  models_name: string;

  @Column()
  brands_id: string;

  @Column('timestamp', { nullable: true })
  deleted: Date | null;

  @ManyToOne(() => CarsBrandsEntity, (entity) => entity.models, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'brands_id' })
  cars_brands_models: CarsBrandsEntity;

  @Column()
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.user_cars_brands_models)
  @JoinColumn({ name: 'user_id' })
  user_cars: UserEntity;
}
