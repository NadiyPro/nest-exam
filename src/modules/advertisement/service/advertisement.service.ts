import { ConflictException, Injectable } from '@nestjs/common';

import { AdvertisementEntity } from '../../../infrastructure/postgres/entities/advertisement.entity';
import { UserEntity } from '../../../infrastructure/postgres/entities/user.entity';
import { AvertisementRepository } from '../../../infrastructure/repository/services/advertisement.repository';
import { CarsBrandsRepository } from '../../../infrastructure/repository/services/cars_brands.repository';
import { CarsModelsRepository } from '../../../infrastructure/repository/services/cars_models.repository';
import { UserRepository } from '../../../infrastructure/repository/services/user.repository';
import { ContentType } from '../../file-storage/enums/file-type.enum';
import { FileImageCarsService } from '../../file-storage/services/file-image-cars.service';
import { AdvertisementJSONService } from '../advertisementJSON_Cron/service/adJSON_Cron.service';
import { CurrencyEnum } from '../enums/currency_enum';
import { AdvertisementReqDto } from '../models/dto/req/advertisement.req.dto';
import { ListAdQueryReqDto } from '../models/dto/req/list-advertisement_query.req.dto';
import { UpdateAdMeReqDto } from '../models/dto/req/update_advertisement.req.dto';
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
    const avertisement = new AdvertisementEntity();
    const { price, original_currency } = avertisement;
    avertisement.price = adReqDto.price;
    avertisement.original_currency = adReqDto.original_currency;
    const rates = this.adJSONServiced.readJSON();

    if (original_currency === 'USD') {
      avertisement.priceUAH = avertisement.price * rates.curBuyingUSD;
      avertisement.priceEUR =
        avertisement.price * (rates.curSalesUSD / rates.curSalesEUR);
      avertisement.priceUSD = avertisement.price;
    } else if (original_currency === 'EUR') {
      avertisement.priceUAH = avertisement.price * rates.curBuyingEUR;
      avertisement.priceUSD =
        avertisement.price * (rates.curSalesEUR / rates.curSalesUSD);
      avertisement.priceEUR = avertisement.price;
    } else {
      avertisement.priceUSD = avertisement.price / rates.curBuyingUSD;
      avertisement.priceEUR = avertisement.price / rates.curBuyingEUR;
      avertisement.priceUAH = avertisement.price;
    }

    // if (original_currency === CurrencyEnum.USD) {
    //   avertisement.priceUAH = avertisement.price * rates.curBuyingUSD;
    //   avertisement.priceEUR =
    //     avertisement.price * (rates.curBuyingUSD / rates.curSalesEUR);
    //   avertisement.priceUSD = avertisement.price;
    // } else if (original_currency === CurrencyEnum.EUR) {
    //   avertisement.priceUAH = avertisement.price * rates.curBuyingEUR;
    //   avertisement.priceUSD =
    //     avertisement.price * (rates.curBuyingEUR / rates.curSalesUSD);
    //   avertisement.priceEUR = avertisement.price;
    // } else if (original_currency === CurrencyEnum.UAH) {
    //   avertisement.priceUSD = avertisement.price / rates.curSalesUSD;
    //   avertisement.priceEUR = avertisement.price / rates.curSalesEUR;
    //   avertisement.priceUAH = avertisement.price;
    // } else {
    //   throw new Error('Unsupported currency type');
    // }

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
      ...avertisement,
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
    userData: IAdvertisemen,
  ): Promise<AdvertisementMeResDto[]> {
    const advertisements = await this.avertisementRepository.find({
      where: { user_id: userData.id },
    });

    if (advertisements.length === 0) {
      throw new Error('No advertisements found for the given user ID');
    }

    return await Promise.all(
      advertisements.map(async (advertisement) => {
        const user = await this.userRepository.findOneBy({
          id: advertisement.user_id,
        });
        if (!user) throw new Error('User not found');

        const model = await this.carsModelsRepository.findOneBy({
          models_id: advertisement.cars_brands_models_id,
        });
        if (!model) throw new Error('Model not found');

        const brand = await this.carsBrandsRepository.findOneBy({
          brands_id: model.brands_id,
        });
        if (!brand) throw new Error('Brand not found');

        return {
          id: advertisement.id,
          user_id: user.id,
          name: user.name,
          phone: user.phone,
          brands_name: brand.brands_name,
          models_name: model.models_name,
          price: advertisement.price,
          original_currency: advertisement.original_currency,
          curBuyingUSD: advertisement.curBuyingUSD,
          curSalesUSD: advertisement.curSalesUSD,
          curBuyingEUR: advertisement.curBuyingEUR,
          curSalesEUR: advertisement.curSalesEUR,
          priceUAH: advertisement.priceUAH,
          priceUSD: advertisement.priceUSD,
          priceEUR: advertisement.priceEUR,
          region: advertisement.region,
          text_advertisement: advertisement.text_advertisement,
          image_cars: advertisement.image_cars,
          isValid: advertisement.isValid,
        };
      }),
    );
  }

  // public async updateAdvertisementMe(
  //   userData: IAdvertisemen,
  //   advertisementId: string,
  //   dto: UpdateAdMeReqDto,
  // ): Promise<AdvertisementResDto> {
  //   const avertisement = await this.avertisementRepository.findOneBy({
  //     id: advertisementId,
  //     user_id: userData.id,
  //   });
  //
  //   avertisement.price = dto.price;
  //   avertisement.original_currency = dto.original_currency;
  //   avertisement.text_advertisement = dto.text_advertisement;
  //
  //   const newAdvertisement = await this.avertisementRepository.save({
  //     ...avertisement,
  //     price: dto.price,
  //     original_currency: dto.original_currency,
  //     text_advertisement: dto.text_advertisement,
  //   });
  //
  //   const user = await this.userRepository.findOneBy({
  //     id: newAdvertisement.user_id,
  //   });
  //
  //   const model = await this.carsModelsRepository.findOneBy({
  //     models_id: newAdvertisement.cars_brands_models_id,
  //   });
  //
  //   if (!model) {
  //     throw new Error('Model not found');
  //   }
  //
  //   const brand = await this.carsBrandsRepository.findOneBy({
  //     brands_id: model.brands_id,
  //   });
  //
  //   if (!brand) {
  //     throw new Error('Brand not found');
  //   }
  //
  //   return {
  //     id: newAdvertisement.id,
  //     user_id: user.id,
  //     name: user.name,
  //     phone: user.phone,
  //     brands_name: brand.brands_name,
  //     models_name: model.models_name,
  //     price: newAdvertisement.price,
  //     original_currency: newAdvertisement.original_currency,
  //     curBuyingUSD: newAdvertisement.curBuyingUSD,
  //     curSalesUSD: newAdvertisement.curSalesUSD,
  //     curBuyingEUR: newAdvertisement.curBuyingEUR,
  //     curSalesEUR: newAdvertisement.curSalesEUR,
  //     priceUAH: newAdvertisement.priceUAH,
  //     priceUSD: newAdvertisement.priceUSD,
  //     priceEUR: newAdvertisement.priceEUR,
  //     region: newAdvertisement.region,
  //     text_advertisement: newAdvertisement.text_advertisement,
  //     isValid: newAdvertisement.isValid,
  //   };
  // }

  public async updateAdvertisementMe(
    userData: IAdvertisemen,
    advertisementId: string,
    dto: UpdateAdMeReqDto,
  ): Promise<AdvertisementResDto> {
    // Перевірка існування оголошення
    const advertisement = await this.avertisementRepository.findOneBy({
      id: advertisementId,
      user_id: userData.id,
    });

    if (!advertisement) {
      throw new Error('Advertisement not found');
    }

    // Оновлення оголошення
    Object.assign(advertisement, {
      price: dto.price,
      original_currency: dto.original_currency,
      text_advertisement: dto.text_advertisement,
    });

    const updatedAdvertisement =
      await this.avertisementRepository.save(advertisement);

    // Отримання пов'язаних даних
    const [user, model] = await Promise.all([
      this.userRepository.findOneBy({ id: updatedAdvertisement.user_id }),
      this.carsModelsRepository.findOneBy({
        models_id: updatedAdvertisement.cars_brands_models_id,
      }),
    ]);

    if (!user) {
      throw new Error('User not found');
    }

    if (!model) {
      throw new Error('Model not found');
    }

    const brand = await this.carsBrandsRepository.findOneBy({
      brands_id: model.brands_id,
    });

    if (!brand) {
      throw new Error('Brand not found');
    }

    // Формування відповіді
    return {
      id: updatedAdvertisement.id,
      user_id: user.id,
      name: user.name,
      phone: user.phone,
      brands_name: brand.brands_name,
      models_name: model.models_name,
      price: updatedAdvertisement.price,
      original_currency: updatedAdvertisement.original_currency,
      curBuyingUSD: updatedAdvertisement.curBuyingUSD,
      curSalesUSD: updatedAdvertisement.curSalesUSD,
      curBuyingEUR: updatedAdvertisement.curBuyingEUR,
      curSalesEUR: updatedAdvertisement.curSalesEUR,
      priceUAH: updatedAdvertisement.priceUAH,
      priceUSD: updatedAdvertisement.priceUSD,
      priceEUR: updatedAdvertisement.priceEUR,
      region: updatedAdvertisement.region,
      text_advertisement: updatedAdvertisement.text_advertisement,
      isValid: updatedAdvertisement.isValid,
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
    const advertisement = await this.avertisementRepository.findOneBy({
      id: advertisementId,
    });

    if (!advertisement) {
      throw new Error('Advertisement not found');
    }

    const user = await this.userRepository.findOneBy({
      id: advertisement.user_id,
    });
    if (!user) throw new Error('User not found');

    const model = await this.carsModelsRepository.findOneBy({
      models_id: advertisement.cars_brands_models_id,
    });
    if (!model) throw new Error('Model not found');

    const brand = await this.carsBrandsRepository.findOneBy({
      brands_id: model.brands_id,
    });
    if (!brand) throw new Error('Brand not found');

    return {
      id: advertisement.id,
      user_id: user.id,
      name: user.name,
      phone: user.phone,
      brands_name: brand.brands_name,
      models_name: model.models_name,
      price: advertisement.price,
      original_currency: advertisement.original_currency,
      curBuyingUSD: advertisement.curBuyingUSD,
      curSalesUSD: advertisement.curSalesUSD,
      curBuyingEUR: advertisement.curBuyingEUR,
      curSalesEUR: advertisement.curSalesEUR,
      priceUAH: advertisement.priceUAH,
      priceUSD: advertisement.priceUSD,
      priceEUR: advertisement.priceEUR,
      region: advertisement.region,
      text_advertisement: advertisement.text_advertisement,
      image_cars: advertisement.image_cars,
      isValid: advertisement.isValid,
    };
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
