import { ConflictException, Injectable } from '@nestjs/common';

import { AdvertisementEntity } from '../../../infrastructure/postgres/entities/advertisement.entity';
import { IsValidEnum } from '../../../infrastructure/postgres/entities/enums/isValid.enum';
import { UserEntity } from '../../../infrastructure/postgres/entities/user.entity';
import { AvertisementRepository } from '../../../infrastructure/repository/services/advertisement.repository';
import { CarsBrandsRepository } from '../../../infrastructure/repository/services/cars_brands.repository';
import { CarsModelsRepository } from '../../../infrastructure/repository/services/cars_models.repository';
import { UserRepository } from '../../../infrastructure/repository/services/user.repository';
import { IUserData } from '../../auth/models/interfaces/user_data.interface';
import { ContentType } from '../../file-storage/enums/file-type.enum';
import { FileImageCarsService } from '../../file-storage/services/file-image-cars.service';
import { AdvertisementJSONService } from '../advertisementJSON/service/advertisementJSON.service';
import { CurrencyEnum } from '../enums/currency_enum';
import { AdvertisementReqDto } from '../models/dto/req/advertisement.req.dto';
import { ListAdQueryReqDto } from '../models/dto/req/list-advertisement_query.req.dto';
import { UpdateAdMeReqDto } from '../models/dto/req/update_advertisement.req.dto';
import { AdvertisementResDto } from '../models/dto/res/advertisement.res.dto';
import { AdvertisementMeResDto } from '../models/dto/res/advertisement_me.res.dto';
import { IAdvertisemen } from '../models/interface/user_advertisemen.interface';
import { AdvertisementMapper } from './advertisement.mapper';

@Injectable()
export class AdvertisementService {
  constructor(
    private readonly fileImageCarsService: FileImageCarsService,
    private readonly userRepository: UserRepository,
    private readonly carsBrandsRepository: CarsBrandsRepository,
    private readonly carsModelsRepository: CarsModelsRepository,
    private readonly avertisementRepository: AvertisementRepository,
    private readonly adJSONServiced: AdvertisementJSONService,
    // private readonly advertisementMapper: AdvertisementMapper,
  ) {}

  public async createAdvertisement(
    userData: IAdvertisemen,
    adReqDto: AdvertisementReqDto,
  ): Promise<AdvertisementResDto> {
    const avertisement = new AdvertisementEntity();
    const { price, original_currency } = avertisement;
    avertisement.price = adReqDto.price;
    avertisement.original_currency = adReqDto.original_currency;
    const rates = this.adJSONServiced.readJSON();

    // if (original_currency === 'USD') {
    //   avertisement.priceUAH = avertisement.price * rates.curSalesUSD;
    //   avertisement.priceEUR =
    //     avertisement.price * (rates.curSalesUSD / rates.curSalesEUR);
    //   avertisement.priceUSD = avertisement.price;
    // } else if (original_currency === 'EUR') {
    //   avertisement.priceUAH = avertisement.price * rates.curSalesEUR;
    //   avertisement.priceUSD =
    //     avertisement.price * (rates.curSalesEUR / rates.curSalesUSD);
    //   avertisement.priceEUR = avertisement.price;
    // } else {
    //   avertisement.priceUSD = avertisement.price / rates.curBuyingUSD;
    //   avertisement.priceEUR = avertisement.price / rates.curBuyingEUR;
    //   avertisement.priceUAH = avertisement.price;
    // }

    if (original_currency === CurrencyEnum.USD) {
      avertisement.priceUAH = avertisement.price * rates.curBuyingUSD;
      avertisement.priceEUR =
        avertisement.price * (rates.curBuyingUSD / rates.curSalesEUR);
      avertisement.priceUSD = avertisement.price;
    } else if (original_currency === CurrencyEnum.EUR) {
      avertisement.priceUAH = avertisement.price * rates.curBuyingEUR;
      avertisement.priceUSD =
        avertisement.price * (rates.curBuyingEUR / rates.curSalesUSD);
      avertisement.priceEUR = avertisement.price;
    } else if (original_currency === CurrencyEnum.UAH) {
      avertisement.priceUSD = avertisement.price / rates.curSalesUSD;
      avertisement.priceEUR = avertisement.price / rates.curSalesEUR;
      avertisement.priceUAH = avertisement.price;
    } else {
      throw new Error('Unsupported currency type');
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
      user_id: user.id,
      price: avertisement.price,
      original_currency: avertisement.original_currency,
      cars_brands_models_id: model.models_id,
      curBuyingUSD: rates.curBuyingUSD,
      curSalesUSD: rates.curSalesUSD,
      curBuyingEUR: rates.curBuyingEUR,
      curSalesEUR: rates.curSalesEUR,
      priceUAH: avertisement.priceUAH,
      priceUSD: avertisement.priceUSD,
      priceEUR: avertisement.priceEUR,
      region: adReqDto.region,
      text_advertisement: adReqDto.text_advertisement,
    });

    const createdAd = {
      id: newAdvertisement.id,
      user_id: newAdvertisement.id,
      name: user.name,
      phone: user.phone,
      brands_name: brand.brands_name,
      models_name: model.models_name,
      price: newAdvertisement.price,
      original_currency: newAdvertisement.original_currency,
      curBuyingUSD: newAdvertisement.curBuyingUSD,
      curSalesUSD: newAdvertisement.curSalesUSD,
      curBuyingEUR: newAdvertisement.curBuyingEUR,
      curSalesEUR: newAdvertisement.curSalesEUR,
      priceUAH: newAdvertisement.priceUAH,
      priceUSD: newAdvertisement.priceUSD,
      priceEUR: newAdvertisement.priceEUR,
      region: newAdvertisement.region,
      text_advertisement: newAdvertisement.text_advertisement,
      isValid: avertisement.isValid,
    };
    return createdAd;
  }

  public async findAdvertisementAll(
    query: ListAdQueryReqDto,
  ): Promise<[AdvertisementEntity[], number]> {
    const [entities, total] =
      await this.avertisementRepository.findAdvertisementAll(query);
    return [entities, total];
  }

  public async findfindAdvertisementMe(
    userData: IUserData,
  ): Promise<AdvertisementMeResDto | AdvertisementMeResDto[]> {
    const avertisement = await this.avertisementRepository.findOneBy({
      user_id: userData.userId,
    });

    if (!avertisement) {
      throw new Error('Advertisement not found for the given user ID');
    }

    const user = await this.userRepository.findOneBy({
      id: avertisement.user_id,
    });

    if (!user) {
      throw new Error('User not found');
    }

    const model = await this.carsModelsRepository.findOneBy({
      models_id: avertisement.cars_brands_models_id,
    });

    if (!model) {
      throw new Error('Model not found');
    }

    const brand = await this.carsBrandsRepository.findOneBy({
      brands_id: model.brands_id,
    });

    if (!brand) {
      throw new Error('Brand not found');
    }

    return {
      id: avertisement.id,
      user_id: user.id,
      name: user.name,
      phone: user.phone,
      brands_name: brand.brands_name,
      models_name: model.models_name,
      price: avertisement.price,
      original_currency: avertisement.original_currency,
      curBuyingUSD: avertisement.curBuyingUSD,
      curSalesUSD: avertisement.curSalesUSD,
      curBuyingEUR: avertisement.curBuyingEUR,
      curSalesEUR: avertisement.curSalesEUR,
      priceUAH: avertisement.priceUAH,
      priceUSD: avertisement.priceUSD,
      priceEUR: avertisement.priceEUR,
      region: avertisement.region,
      text_advertisement: avertisement.text_advertisement,
      image_cars: avertisement.image_cars,
      isValid: avertisement.isValid,
    };
  }

  public async updateAdvertisementMe(
    userData: IAdvertisemen,
    advertisementId: string,
    dto: UpdateAdMeReqDto,
  ): Promise<AdvertisementResDto> {
    const avertisement = await this.avertisementRepository.findOneBy({
      id: advertisementId,
      user_id: userData.id,
    });

    const newAdvertisement = await this.avertisementRepository.save({
      ...avertisement,
      price: dto.price,
      original_currency: dto.original_currency,
      text_advertisement: dto.text_advertisement,
    });

    const user = await this.userRepository.findOneBy({
      id: newAdvertisement.user_id,
    });

    const model = await this.carsModelsRepository.findOneBy({
      models_id: newAdvertisement.cars_brands_models_id,
    });

    if (!model) {
      throw new Error('Model not found');
    }

    const brand = await this.carsBrandsRepository.findOneBy({
      brands_id: model.brands_id,
    });

    if (!brand) {
      throw new Error('Brand not found');
    }

    return {
      id: newAdvertisement.id,
      user_id: user.id,
      name: user.name,
      phone: user.phone,
      brands_name: brand.brands_name,
      models_name: model.models_name,
      price: newAdvertisement.price,
      original_currency: newAdvertisement.original_currency,
      curBuyingUSD: newAdvertisement.curBuyingUSD,
      curSalesUSD: newAdvertisement.curSalesUSD,
      curBuyingEUR: newAdvertisement.curBuyingEUR,
      curSalesEUR: newAdvertisement.curSalesEUR,
      priceUAH: newAdvertisement.priceUAH,
      priceUSD: newAdvertisement.priceUSD,
      priceEUR: newAdvertisement.priceEUR,
      region: newAdvertisement.region,
      text_advertisement: newAdvertisement.text_advertisement,
      isValid: newAdvertisement.isValid,
    };
  }

  public async deleteAdvertisementMe(
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
    await this.avertisementRepository.delete(advertisementId);
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

    const model = await this.carsModelsRepository.findOneBy({
      models_id: avertisement.cars_brands_models_id,
    });

    if (!model) {
      throw new Error('Model not found');
    }

    const brand = await this.carsBrandsRepository.findOneBy({
      brands_id: model.brands_id,
    });

    if (!brand) {
      throw new Error('Brand not found');
    }

    return {
      id: avertisement.id,
      user_id: user.id,
      name: user.name,
      phone: user.phone,
      brands_name: brand.brands_name,
      models_name: model.models_name,
      price: avertisement.price,
      original_currency: avertisement.original_currency,
      curBuyingUSD: avertisement.curBuyingUSD,
      curSalesUSD: avertisement.curSalesUSD,
      curBuyingEUR: avertisement.curBuyingEUR,
      curSalesEUR: avertisement.curSalesEUR,
      priceUAH: avertisement.priceUAH,
      priceUSD: avertisement.priceUSD,
      priceEUR: avertisement.priceEUR,
      region: avertisement.region,
      text_advertisement: avertisement.text_advertisement,
      image_cars: avertisement.image_cars,
      isValid: avertisement.isValid,
    };
    // return avertisement;
  }

  public async deleteAdvertisementId(advertisementId: string): Promise<string> {
    const advertisement = await this.avertisementRepository.findOneBy({
      id: advertisementId,
    });
    if (!advertisement) {
      throw new ConflictException('The specified brand does not exist');
    }
    await this.avertisementRepository.delete(advertisementId);
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
    // for (const fileOne in file) {
    //   const advertisement = await this.avertisementRepository.findOneBy({
    //     id: advertisementId,
    //   });
    //   const pathToFile = await this.fileImageCarsService.uploadFile(
    //     file[0],
    //     ContentType.IMAGE_CARS,
    //     advertisementId,
    //   );
    //
    //   if (advertisement.image_cars) {
    //     await this.fileImageCarsService.deleteFile(advertisement.image_cars);
    //   }
    //   console.log(advertisement.image_cars);
    //   await this.avertisementRepository.save({
    //     ...advertisement,
    //     image_cars: pathToFile,
    //   });
    // }
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
