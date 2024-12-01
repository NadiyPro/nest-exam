import { AdvertisementEntity } from '../../../infrastructure/postgres/entities/advertisement.entity';
import { CarsBrandsRepository } from '../../../infrastructure/repository/services/cars_brands.repository';
import { CarsModelsRepository } from '../../../infrastructure/repository/services/cars_models.repository';
import { UserRepository } from '../../../infrastructure/repository/services/user.repository';
import { ListAdQueryReqDto } from '../models/dto/req/list-advertisement_query.req.dto';
import { AdvertisementMeResDto } from '../models/dto/res/advertisement_me.res.dto';
import { ListAdAllQueryResDto } from '../models/dto/res/list-advertisement_query.res.dto';

export class AdvertisementMapper {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly carsBrandsRepository: CarsBrandsRepository,
    private readonly carsModelsRepository: CarsModelsRepository,
  ) {}

  public async toResAdDto(
    advertisement: AdvertisementEntity,
  ): Promise<AdvertisementMeResDto> {
    const user = await this.userRepository.findOneBy({
      id: advertisement.user_id,
    });

    const model = await this.carsModelsRepository.findOneBy({
      models_id: advertisement.cars_brands_models_id,
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
      id: advertisement.id,
      user_id: advertisement.user_id,
      name: user.name,
      phone: user.phone,
      brands_name: brand.brands_name,
      models_name: model.models_name,
      price: advertisement.price,
      original_currency: advertisement.original_currency,
      region: advertisement.region,
      text_advertisement: advertisement.text_advertisement,
      curBuyingUSD: advertisement.curBuyingUSD,
      curSalesUSD: advertisement.curSalesUSD,
      curBuyingEUR: advertisement.curBuyingEUR,
      curSalesEUR: advertisement.curSalesEUR,
      priceUSD: advertisement.priceUSD,
      priceEUR: advertisement.priceEUR,
      priceUAH: advertisement.priceUAH,
      image_cars: advertisement.image_cars,
      isValid: advertisement.isValid,
    };
  }

  public async toAllAdResDtoList(
    advertisement: AdvertisementEntity[],
    total: number,
    query: ListAdQueryReqDto,
  ): Promise<ListAdAllQueryResDto> {
    const advertisements = await Promise.all(
      advertisement.map((ad) => this.toResAdDto(ad)),
    );

    return {
      advertisement: advertisements,
      total,
      ...query,
    };
  }
}
