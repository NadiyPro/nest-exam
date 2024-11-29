import { Injectable } from '@nestjs/common';

import { AvertisementRepository } from '../../../infrastructure/repository/services/advertisement.repository';
import { CarsBrandsRepository } from '../../../infrastructure/repository/services/cars_brands.repository';
import { CarsModelsRepository } from '../../../infrastructure/repository/services/cars_models.repository';
import { RefreshTokenRepository } from '../../../infrastructure/repository/services/refresh-token.repository';
import { UserRepository } from '../../../infrastructure/repository/services/user.repository';
import { AuthUserResDto } from '../../auth/models/dto/res/auth_user.res.dto';
import { IUserData } from '../../auth/models/interfaces/user_data.interface';
import { ContentType } from '../../file-storage/enums/file-type.enum';
import { FileAvatarService } from '../../file-storage/services/file-avatar.service';
import { FileImageCarsService } from '../../file-storage/services/file-image-cars.service';
import { CurrencyEnum } from '../enums/currency_enum';
import { AdvertisementReqDto } from '../models/dto/req/advertisement.req.dto';
import { BaseResDto } from '../models/dto/res/advertisement.res.dto';
import { IAdvertisemen } from '../models/interface/user_advertisemen.interface';

@Injectable()
export class AdvertisementService {
  constructor(
    // private readonly configService: ConfigService<Config>,
    private readonly fileImageCarsService: FileImageCarsService,
    private readonly userRepository: UserRepository,
    private readonly carsBrandsRepository: CarsBrandsRepository,
    private readonly carsModelsRepository: CarsModelsRepository,
    private readonly avertisementRepository: AvertisementRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  public async creteAdvertisement(
    userData: IAdvertisemen,
    adReqDto: AdvertisementReqDto,
    file: Express.Multer.File,
  ): Promise<BaseResDto> {
    const user = await this.userRepository.findOneBy({
      id: userData.id,
    }); // витягаємо дані по юзеру
    ///////// витягаємо дані по cars/////
    const new_brand = await this.carsBrandsRepository.findOneBy({
      brands_name: adReqDto.brands_name,
      user_id: userData.id,
    });
    const new_model = await this.carsModelsRepository.findOneBy({
      models_name: adReqDto.models_name,
      brands_id: new_brand.brands_id,
      user_id: userData.id,
    });
    //////////////////////////IMAGE_CARS//////////////////////////////
    const avertisement = await this.avertisementRepository.findOneBy({
      user_id: user.id,
    });
    const pathToFile = await this.fileImageCarsService.uploadFile(
      file,
      ContentType.IMAGE_CARS,
      userData.id,
    );
    if (file.filename === avertisement.image_cars) {
      await this.fileImageCarsService.deleteFile(avertisement.image_cars);
    }

    return await this.avertisementRepository.save({
      ...avertisement,
      image_cars: pathToFile,
      user_id: user.id,
      name: user.name,
      phone: user.phone,
      brands_name: new_brand.brands_name,
      models_name: new_model.models_name,
      price: adReqDto.price,
      original_currency: adReqDto.original_currency,
      region: adReqDto.region,
      text_advertisement: adReqDto.text_advertisement,
    });
  }

  // public async deleteAvatar(userData: IUserData): Promise<void> {
  //   const user = await this.userRepository.findOneBy({ id: userData.userId });
  //   if (user.avatar) {
  //     await this.fileStorageService.deleteFile(user.avatar);
  //     await this.userRepository.save({ ...user, avatar: null });
  //   }
  // }
}
