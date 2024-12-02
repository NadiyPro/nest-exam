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

    // Ініціалізація ціни з adReqDto
    const { price, original_currency } = adReqDto;

    // Перевірка валюти перед використанням
    if (!['USD', 'EUR', 'UAH'].includes(original_currency)) {
      throw new ConflictException('Unsupported currency type');
    }

    avertisement.original_currency = original_currency;
    avertisement.price = price; // Присвоєння ціни

    // Читання курсів валют
    const rates = this.adJSONServiced.readJSON();

    // Перевірка наявності курсів валют
    if (
      !rates ||
      !rates.curBuyingUSD ||
      !rates.curSalesUSD ||
      !rates.curBuyingEUR ||
      !rates.curSalesEUR
    ) {
      throw new ConflictException('Currency rates are not available');
    }

    // Обчислення цін за умовами валюти
    if (original_currency === 'USD') {
      avertisement.priceUAH = price * rates.curBuyingUSD;
      avertisement.priceEUR = price * (rates.curSalesUSD / rates.curSalesEUR);
      avertisement.priceUSD = price;
    } else if (original_currency === 'EUR') {
      avertisement.priceUAH = price * rates.curBuyingEUR;
      avertisement.priceUSD = price * (rates.curSalesEUR / rates.curSalesUSD);
      avertisement.priceEUR = price;
    } else {
      avertisement.priceUSD = price / rates.curBuyingUSD;
      avertisement.priceEUR = price / rates.curBuyingEUR;
      avertisement.priceUAH = price;
    }

    const user = await this.userRepository.findOneBy({ id: userData.id });

    const brand = await this.carsBrandsRepository.findOneBy({
      brands_name: adReqDto.brands_name,
      user_id: userData.id,
    });

    if (!brand) {
      throw new ConflictException('Brand not found');
    }

    const model = await this.carsModelsRepository.findOneBy({
      models_name: adReqDto.models_name,
      brands_id: brand.brands_id,
      user_id: userData.id,
    });

    if (!model) {
      throw new ConflictException('Model not found');
    }

    const newAdvertisement = await this.avertisementRepository.save({
      ...avertisement,
      user_id: user.id,
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

  public async updateAdvertisementMe(
    userData: IAdvertisemen,
    advertisementId: string,
    dto: UpdateAdMeReqDto,
  ): Promise<AdvertisementResDto> {
    const avertisement = await this.avertisementRepository.findOne({
      where: {
        id: advertisementId,
        user_id: userData.id,
      },
    });

    avertisement.price = dto.price;
    avertisement.original_currency = dto.original_currency;
    avertisement.text_advertisement = dto.text_advertisement;

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
