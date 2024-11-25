import { IsString, Length } from 'class-validator';

export class CreateCarsReqDto {
  @IsString()
  @Length(3, 50)
  brands_name: string;
  @IsString()
  @Length(3, 50)
  models_name: string;
  // userId: string;
}