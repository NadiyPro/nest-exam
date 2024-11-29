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

@Injectable()
export class AdvertisementService {
  constructor(
    private readonly fileImageCarsService: FileImageCarsService,
    private readonly userRepository: UserRepository,
    private readonly carsBrandsRepository: CarsBrandsRepository,
    private readonly carsModelsRepository: CarsModelsRepository,
    private readonly avertisementRepository: AvertisementRepository,
    private readonly advertisementJSONService: AdvertisementJSONService,
  ) {}

  public async createAdvertisement(
    userData: IAdvertisemen,
    adReqDto: AdvertisementReqDto,
    file: Express.Multer.File,
    ad: AdvertisementEntity,
    rates: {
      curBuyingUSD: number;
      curSalesUSD: number;
      curBuyingEUR: number;
      curSalesEUR: number;
    },
  ): Promise<AdvertisementResDto> {
    const { price, original_currency } = ad;

    // Розрахунок валют
    let priceUAH, priceUSD, priceEUR;

    if (original_currency === 'USD') {
      priceUAH = price * rates.curSalesUSD;
      priceEUR = price * (rates.curSalesUSD / rates.curSalesEUR);
      priceUSD = price;
    } else if (original_currency === 'EUR') {
      priceUAH = price * rates.curSalesEUR;
      priceUSD = price * (rates.curSalesEUR / rates.curSalesUSD);
      priceEUR = price;
    } else {
      priceUSD = price / rates.curBuyingUSD;
      priceEUR = price / rates.curBuyingEUR;
      priceUAH = price;
    }

    // Отримання користувача
    const user = await this.userRepository.findOneBy({ id: userData.id });

    // Отримання даних про бренд та модель
    const newBrand = await this.carsBrandsRepository.findOneBy({
      brands_name: adReqDto.brands_name,
      user_id: userData.id,
    });

    const newModel = await this.carsModelsRepository.findOneBy({
      models_name: adReqDto.models_name,
      brands_id: newBrand.brands_id,
      user_id: userData.id,
    });

    // Завантаження зображення
    const pathToFile = await this.fileImageCarsService.uploadFile(
      file,
      ContentType.IMAGE_CARS,
      userData.id,
    );

    const existingAd = await this.avertisementRepository.findOneBy({
      user_id: user.id,
    });

    if (existingAd?.image_cars) {
      await this.fileImageCarsService.deleteFile(existingAd.image_cars);
    }

    // Збереження реклами
    const newAdvertisement = await this.avertisementRepository.save({
      ...ad,
      user_id: user.id,
      name: user.name,
      phone: user.phone,
      brands_name: newBrand.brands_name,
      models_name: newModel.models_name,
      image_cars: pathToFile,
      priceUAH,
      priceUSD,
      priceEUR,
    });

    return newAdvertisement;
  }
}
// constructor(
//   // private readonly configService: ConfigService<Config>,
//   private readonly fileImageCarsService: FileImageCarsService,
//   private readonly userRepository: UserRepository,
//   private readonly carsBrandsRepository: CarsBrandsRepository,
//   private readonly carsModelsRepository: CarsModelsRepository,
//   private readonly avertisementRepository: AvertisementRepository,
//   private readonly advertisementJSONService: AdvertisementJSONService,
// ) {}
//
// public async creteAdvertisement(
//   userData: IAdvertisemen,
//   adReqDto: AdvertisementReqDto,
//   file: Express.Multer.File,
// ): Promise<AdvertisementResDto> {
//   const user = await this.userRepository.findOneBy({
//     id: userData.id,
//   }); // витягаємо дані по юзеру
//   ///////// витягаємо дані по cars/////
//   const new_brand = await this.carsBrandsRepository.findOneBy({
//     brands_name: adReqDto.brands_name,
//     user_id: userData.id,
//   });
//   const new_model = await this.carsModelsRepository.findOneBy({
//     models_name: adReqDto.models_name,
//     brands_id: new_brand.brands_id,
//     user_id: userData.id,
//   });
//   //////////////////////////IMAGE_CARS//////////////////////////////
//   const avertisement = await this.avertisementRepository.findOneBy({
//     user_id: user.id,
//   });
//   const pathToFile = await this.fileImageCarsService.uploadFile(
//     file,
//     ContentType.IMAGE_CARS,
//     userData.id,
//   );
//   if (file.filename === avertisement.image_cars) {
//     await this.fileImageCarsService.deleteFile(avertisement.image_cars);
//   }
//
//   const currency =
//     await this.advertisementJSONService.importAdvertisementJSON();
//   const curBuyingUSD = currency.curBuyingUSD;
//   const curSalesUSD = currency.curBuyingUSD;
//   const curBuyingEUR = currency.curBuyingUSD;
//   const curSalesEUR = currency.curBuyingUSD;
//
//   const priceUAH = await if (adReqDto.original_currency !== CurrencyEnum.UAH){
//     If (CurrencyEnum.UAH === CurrencyEnum.USD){
//       const priceUAHUSD = adReqDto.price * curBuyingUSD
//     } else {
//       const priceUAHUSD = adReqDto.price * curSalesEUR
//     }
//   } else { priceUAH = adReqDto.price}
//
//   priceUSD = if (adReqDto.original_currency !== CurrencyEnum.USD){
//     If (CurrencyEnum.UAH === CurrencyEnum.USD){
//       const priceUAHEUR = adReqDto.price * curBuyingUAH
//     } else {
//       const priceUAHUSD = adReqDto.price * curSalesEUR
//     }
//   } else { priceUAH = adReqDto.price}
//
//
//   priceEUR =
//
//    const avertisemen = await this.avertisementRepository.save({
//     ...avertisement,
//     image_cars: pathToFile,
//     user_id: user.id,
//     name: user.name,
//     phone: user.phone,
//     brands_name: new_brand.brands_name,
//     models_name: new_model.models_name,
//     price: adReqDto.price,
//     original_currency: adReqDto.original_currency,
//     region: adReqDto.region,
//     text_advertisement: adReqDto.text_advertisement,
//      priceUAH: priceUAH,
//      priceUSD: priceUSD,
//      priceEUR: priceEUR,
//      curBuyingUSD: curBuyingUSD,
//      curSalesUSD: curSalesUSD,
//      curBuyingEUR: curBuyingEUR,
//      curSalesEUR: curSalesEUR
//   });
//   return avertisemen;
// }

// public async deleteAvatar(userData: IUserData): Promise<void> {
//   const user = await this.userRepository.findOneBy({ id: userData.userId });
//   if (user.avatar) {
//     await this.fileStorageService.deleteFile(user.avatar);
//     await this.userRepository.save({ ...user, avatar: null });
//   }
// }
