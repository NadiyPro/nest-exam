import { AdvertisementEntity } from '../../../infrastructure/postgres/entities/advertisement.entity';
import { ListAdQueryReqDto } from '../models/dto/req/list-advertisement_query.req.dto';
import { AdvertisementMeResDto } from '../models/dto/res/advertisement_me.res.dto';
import { ListAdAllQueryResDto } from '../models/dto/res/list-advertisement_query.res.dto';

export class AdvertisementMapper {
  public static toResAdDto(
    advertisement: AdvertisementEntity,
  ): AdvertisementMeResDto {
    return {
      id: advertisement.id,
      user_id: advertisement.user_id,
      name: advertisement.name,
      phone: advertisement.phone,
      brands_name: advertisement.brands_name,
      models_name: advertisement.models_name,
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
    };
  }

  public static toAllAdResDtoList(
    advertisement: AdvertisementEntity[],
    total: number,
    query: ListAdQueryReqDto,
  ): ListAdAllQueryResDto {
    return {
      advertisement: advertisement.map(this.toResAdDto),
      total,
      ...query,
    };
  }
}
