import { Injectable } from '@nestjs/common';

import { AdvertisementEntity } from '../../../infrastructure/postgres/entities/advertisement.entity';
import { AvertisementRepository } from '../../../infrastructure/repository/services/advertisement.repository';
import { CarsBrandsRepository } from '../../../infrastructure/repository/services/cars_brands.repository';
import { CarsModelsRepository } from '../../../infrastructure/repository/services/cars_models.repository';
import { UserRepository } from '../../../infrastructure/repository/services/user.repository';
import { ContentType } from '../../file-storage/enums/file-type.enum';
import { FileImageCarsService } from '../../file-storage/services/file-image-cars.service';
import { AdvertisementJSONService } from '../advertisementJSON/service/advertisementJSON.service';
import { AdvertisementReqDto } from '../models/dto/req/advertisement.req.dto';
import { AdvertisementResDto } from '../models/dto/res/advertisement.res.dto';
import { IAdvertisemen } from '../models/interface/user_advertisemen.interface';
import { IUserData } from '../../auth/models/interfaces/user_data.interface';
import { UserEntity } from '../../../infrastructure/postgres/entities/user.entity';

@Injectable()
export class AdvertisementService {
  constructor(
    private readonly fileImageCarsService: FileImageCarsService,
    private readonly userRepository: UserRepository,
    private readonly carsBrandsRepository: CarsBrandsRepository,
    private readonly carsModelsRepository: CarsModelsRepository,
    private readonly avertisementRepository: AvertisementRepository,
    private readonly adJSONServiced: AdvertisementJSONService,
  ) {}

  public async createAdvertisement(
    userData: IAdvertisemen,
    adReqDto: AdvertisementReqDto,
  ): Promise<AdvertisementResDto> {
    const ad = new AdvertisementEntity();
    const { price, original_currency } = ad;
    ad.price = adReqDto.price;
    ad.original_currency = adReqDto.original_currency;
    const rates = this.adJSONServiced.readJSON();

    if (original_currency === 'USD') {
      ad.priceUAH = ad.price * rates.curSalesUSD;
      ad.priceEUR = ad.price * (rates.curSalesUSD / rates.curSalesEUR);
      ad.priceUSD = ad.price;
    } else if (original_currency === 'EUR') {
      ad.priceUAH = ad.price * rates.curSalesEUR;
      ad.priceUSD = ad.price * (rates.curSalesEUR / rates.curSalesUSD);
      ad.priceEUR = ad.price;
    } else {
      ad.priceUSD = ad.price / rates.curBuyingUSD;
      ad.priceEUR = ad.price / rates.curBuyingEUR;
      ad.priceUAH = ad.price;
    }

    const user = await this.userRepository.findOneBy({ id: userData.id });

    const newBrand = await this.carsBrandsRepository.findOneBy({
      brands_name: adReqDto.brands_name,
      user_id: userData.id,
    });

    if (!newBrand) {
      throw new Error('Brand not found');
    }

    const newModel = await this.carsModelsRepository.findOneBy({
      models_name: adReqDto.models_name,
      brands_id: newBrand.brands_id,
      user_id: userData.id,
    });

    if (!newModel) {
      throw new Error('Model not found');
    }

    const newAdvertisement = await this.avertisementRepository.save({
      ...ad,
      user_id: user.id,
      name: user.name,
      phone: user.phone,
      brands_name: newBrand.brands_name,
      models_name: newModel.models_name,
      cars_brands_models_id: newModel.models_id,
      curBuyingUSD: rates.curBuyingUSD,
      curSalesUSD: rates.curSalesUSD,
      curBuyingEUR: rates.curBuyingEUR,
      curSalesEUR: rates.curSalesEUR,
      priceUAH: ad.priceUAH,
      priceUSD: ad.priceUSD,
      priceEUR: ad.priceEUR,
      region: adReqDto.region,
      text_advertisement: adReqDto.text_advertisement,
    });

    return newAdvertisement;
  }


  public async uploadImageCars(
    userData: IUserData,
    file: Express.Multer.File,
  ): Promise<void> {
    const user = await this.avertisementRepository.findOneBy({ user_id: userData.userId });
    const pathToFile = await this.fileImageCarsService.uploadFile(
      file,
      ContentType.IMAGE_CARS,
      userData.userId,
    );

    if (user.image_cars) {
      await this.fileImageCarsService.deleteFile(user.image_cars);
    }
    console.log(user.image_cars);
    await this.avertisementRepository.save({ ...user, image_cars: pathToFile });
  }

  public async deleteImageCars(userData: IUserData): Promise<void> {
    const user = await this.avertisementRepository.findOneBy({ id: userData.userId });
    if (user.image_cars) {
      await this.fileImageCarsService.deleteFile(user.image_cars);
      await this.avertisementRepository.save({ ...user, image_cars: null });
    }
  }

  public async findAllManager(): Promise<UserEntity[]> {
    return await this.userRepository.findAllManager();
  }
}
