import { ConflictException, Injectable } from '@nestjs/common';

import { AdvertisementEntity } from '../../../infrastructure/postgres/entities/advertisement.entity';
import { UserEntity } from '../../../infrastructure/postgres/entities/user.entity';
import { AvertisementRepository } from '../../../infrastructure/repository/services/advertisement.repository';
import { CarsBrandsRepository } from '../../../infrastructure/repository/services/cars_brands.repository';
import { CarsModelsRepository } from '../../../infrastructure/repository/services/cars_models.repository';
import { UserRepository } from '../../../infrastructure/repository/services/user.repository';
import { IUserData } from '../../auth/models/interfaces/user_data.interface';
import { ContentType } from '../../file-storage/enums/file-type.enum';
import { FileImageCarsService } from '../../file-storage/services/file-image-cars.service';
import { AdvertisementJSONService } from '../advertisementJSON/service/advertisementJSON.service';
import { AdvertisementReqDto } from '../models/dto/req/advertisement.req.dto';
import { AdvertisementResDto } from '../models/dto/res/advertisement.res.dto';
import { AdvertisementMeResDto } from '../models/dto/res/advertisement_me.res.dto';
import { IAdvertisemen } from '../models/interface/user_advertisemen.interface';

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

    const brand = await this.carsBrandsRepository.findOneBy({
      brands_name: adReqDto.brands_name,
      user_id: userData.id,
    });

    if (!brand) {
      throw new Error('Brand not found');
    }

    const model = await this.carsModelsRepository.findOneBy({
      models_name: adReqDto.models_name,
      brands_id: brand.brands_id,
      user_id: userData.id,
    });

    if (!model) {
      throw new Error('Model not found');
    }

    const newAdvertisement = await this.avertisementRepository.save({
      ...ad,
      user_id: user.id,
      name: user.name,
      phone: user.phone,
      brands_name: brand.brands_name,
      models_name: model.models_name,
      cars_brands_models_id: model.models_id,
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

  public async findfindAdvertisementMe(
    userData: IUserData,
  ): Promise<AdvertisementMeResDto> {
    const avertisement = await this.avertisementRepository.findOneBy({
      user_id: userData.userId,
    });
    const user = await this.userRepository.findOneBy({
      id: avertisement.user_id,
    });

    const models = await this.carsModelsRepository.findOneBy({
      models_id: avertisement.cars_brands_models_id,
    });

    if (!models) {
      throw new Error('Model not found');
    }

    const brands = await this.carsBrandsRepository.findOneBy({
      brands_id: models.brands_id,
    });

    if (!brands) {
      throw new Error('Brand not found');
    }

    return {
      id: avertisement.id,
      user_id: avertisement.user_id,
      name: user.name,
      phone: user.phone,
      brands_name: brands.brands_name,
      models_name: models.models_name,
      price: avertisement.price,
      original_currency: avertisement.original_currency,
      region: avertisement.region,
      text_advertisement: avertisement.text_advertisement,
      curBuyingUSD: avertisement.curBuyingUSD,
      curSalesUSD: avertisement.curSalesUSD,
      curBuyingEUR: avertisement.curBuyingEUR,
      curSalesEUR: avertisement.curSalesEUR,
      priceUSD: avertisement.priceUSD,
      priceEUR: avertisement.priceEUR,
      priceUAH: avertisement.priceUAH,
      image_cars: avertisement.image_cars,
      // isValid: IsValidEnum;
    };
  }

  public async deleteAdvertisement(
    userData: IAdvertisemen,
    advertisementId: string,
  ): Promise<string> {
    const advertisement = await this.avertisementRepository.findOneBy({
      id: advertisementId,
      user_id: userData.id,
    });
    if (!advertisement) {
      throw new ConflictException('The specified brand does not exist');
    }
    await this.avertisementRepository.delete(advertisement);
    return 'Advertisement deleted successfully';
  }

  public async findfindAdvertisementId(
    advertisementId: string,
  ): Promise<AdvertisementMeResDto> {
    const avertisement = await this.avertisementRepository.findOneBy({
      id: advertisementId,
    });

    const user = await this.userRepository.findOneBy({
      id: avertisement.user_id,
    });

    const models = await this.carsModelsRepository.findOneBy({
      models_id: avertisement.cars_brands_models_id,
    });

    if (!models) {
      throw new Error('Model not found');
    }

    const brands = await this.carsBrandsRepository.findOneBy({
      brands_id: models.brands_id,
    });

    if (!brands) {
      throw new Error('Brand not found');
    }

    return {
      id: avertisement.id,
      user_id: avertisement.user_id,
      name: user.name,
      phone: user.phone,
      brands_name: brands.brands_name,
      models_name: models.models_name,
      price: avertisement.price,
      original_currency: avertisement.original_currency,
      region: avertisement.region,
      text_advertisement: avertisement.text_advertisement,
      curBuyingUSD: avertisement.curBuyingUSD,
      curSalesUSD: avertisement.curSalesUSD,
      curBuyingEUR: avertisement.curBuyingEUR,
      curSalesEUR: avertisement.curSalesEUR,
      priceUSD: avertisement.priceUSD,
      priceEUR: avertisement.priceEUR,
      priceUAH: avertisement.priceUAH,
      image_cars: avertisement.image_cars,
      // isValid: IsValidEnum;
    };
  }

  public async deleteAdvertisementId(advertisementId: string): Promise<string> {
    const advertisement = await this.avertisementRepository.findOneBy({
      id: advertisementId,
    });
    if (!advertisement) {
      throw new ConflictException('The specified brand does not exist');
    }
    await this.avertisementRepository.delete(advertisement);
    return 'Advertisement deleted successfully';
  }

  public async uploadImageCars(
    advertisementId: string,
    file: Express.Multer.File,
  ): Promise<void> {
    const advertisement = await this.avertisementRepository.findOneBy({
      id: advertisementId,
    });
    const pathToFile = await this.fileImageCarsService.uploadFile(
      file,
      ContentType.IMAGE_CARS,
      advertisementId,
    );

    if (advertisement.image_cars) {
      await this.fileImageCarsService.deleteFile(advertisement.image_cars);
    }
    console.log(advertisement.image_cars);
    await this.avertisementRepository.save({
      ...advertisement,
      image_cars: pathToFile,
    });
  }

  public async deleteImageCars(advertisemenId: string): Promise<void> {
    const advertisement = await this.avertisementRepository.findOneBy({
      id: advertisemenId,
    });
    if (advertisement.image_cars) {
      await this.fileImageCarsService.deleteFile(advertisement.image_cars);
      await this.avertisementRepository.save({
        ...advertisement,
        image_cars: null,
      });
    }
  }

  public async findAllManager(): Promise<UserEntity[]> {
    return await this.userRepository.findAllManager();
  }
}
